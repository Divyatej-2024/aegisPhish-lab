type UrlSignal = {
  code: string;
  message: string;
  weight: number;
};

export type UrlFinding = {
  url: string;
  domain: string;
  riskScore: number;
  signals: UrlSignal[];
};

export type UrlAnalysis = {
  findings: UrlFinding[];
  riskScore: number;
  reasons: string[];
  iocs: {
    urls: string[];
    domains: string[];
  };
};

const SHORTENERS = new Set(["bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd"]);
const SUSPICIOUS_TLDS = new Set(["zip", "top", "click", "work", "cam", "gq", "cf", "tk", "xyz"]);

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const toUrlObject = (candidate: string): URL | null => {
  const trimmed = candidate.trim();
  if (!trimmed) return null;

  try {
    return new URL(trimmed);
  } catch {
    if (/^www\./i.test(trimmed)) {
      try {
        return new URL(`https://${trimmed}`);
      } catch {
        return null;
      }
    }
    return null;
  }
};

const extractFromText = (text: string): string[] => {
  const urls = new Set<string>();
  for (const match of text.matchAll(/https?:\/\/[^\s<>"')]+/gi)) {
    if (match[0]) urls.add(match[0].replace(/[.,;!?]+$/, ""));
  }
  for (const match of text.matchAll(/\bwww\.[^\s<>"')]+/gi)) {
    if (match[0]) urls.add(match[0].replace(/[.,;!?]+$/, ""));
  }
  return [...urls];
};

const analyzeSingleUrl = (rawUrl: string): UrlFinding | null => {
  const parsed = toUrlObject(rawUrl);
  if (!parsed) return null;

  const host = parsed.hostname.toLowerCase();
  const tld = host.split(".").at(-1) ?? "";
  const subdomainCount = Math.max(0, host.split(".").length - 2);

  const signals: UrlSignal[] = [];
  let score = 0;

  if (parsed.protocol !== "https:") {
    signals.push({
      code: "insecure-http",
      message: "URL does not use HTTPS.",
      weight: 22,
    });
    score += 22;
  }
  if (SHORTENERS.has(host)) {
    signals.push({
      code: "shortened-url",
      message: "Shortened URL may hide destination.",
      weight: 20,
    });
    score += 20;
  }
  if (subdomainCount >= 3) {
    signals.push({
      code: "deep-subdomain",
      message: "Deep subdomain structure may indicate domain impersonation.",
      weight: 15,
    });
    score += 15;
  }
  if (host.includes("xn--")) {
    signals.push({
      code: "punycode",
      message: "Punycode domain can be used for lookalike attacks.",
      weight: 20,
    });
    score += 20;
  }
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    signals.push({
      code: "ip-host",
      message: "Direct IP address in URL is unusual for legitimate login flows.",
      weight: 18,
    });
    score += 18;
  }
  if (SUSPICIOUS_TLDS.has(tld)) {
    signals.push({
      code: "suspicious-tld",
      message: `TLD .${tld} has elevated abuse prevalence.`,
      weight: 14,
    });
    score += 14;
  }
  if ((host.match(/-/g) ?? []).length >= 3) {
    signals.push({
      code: "hyphenated-domain",
      message: "Highly hyphenated hostnames may mimic trusted brands.",
      weight: 8,
    });
    score += 8;
  }
  if (parsed.username || parsed.password) {
    signals.push({
      code: "credential-in-url",
      message: "Embedded credentials in URL are suspicious.",
      weight: 18,
    });
    score += 18;
  }

  return {
    url: parsed.toString(),
    domain: host,
    riskScore: clamp(score),
    signals: signals.sort((a, b) => b.weight - a.weight),
  };
};

export const analyzeUrls = (input: { text?: string; url?: string }): UrlAnalysis => {
  const textUrls = extractFromText(input.text ?? "");
  const allCandidates = new Set<string>(textUrls);
  if (input.url?.trim()) allCandidates.add(input.url.trim());

  const findings = [...allCandidates]
    .map((candidate) => analyzeSingleUrl(candidate))
    .filter((value): value is UrlFinding => Boolean(value));

  const riskScore = findings.length
    ? Math.round(findings.reduce((sum, current) => sum + current.riskScore, 0) / findings.length)
    : 0;

  const reasons = [...new Set(findings.flatMap((finding) => finding.signals.map((signal) => signal.message)))].slice(0, 6);

  return {
    findings,
    riskScore,
    reasons,
    iocs: {
      urls: findings.map((finding) => finding.url),
      domains: [...new Set(findings.map((finding) => finding.domain))],
    },
  };
};
