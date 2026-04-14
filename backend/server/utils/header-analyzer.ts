type HeaderSignal = {
  code: string;
  message: string;
  weight: number;
};

export type HeaderAnalysis = {
  riskScore: number;
  reasons: string[];
  signals: HeaderSignal[];
  extracted: {
    fromDomain: string | null;
    returnPathDomain: string | null;
    replyToDomain: string | null;
    senderDomain: string | null;
  };
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const extractDomainFromEmail = (value: string | null): string | null => {
  if (!value) return null;
  const direct = value.match(/[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  return direct?.[1]?.toLowerCase() ?? null;
};

const parseHeaders = (rawHeaders: string) => {
  const map = new Map<string, string>();
  const lines = rawHeaders.split(/\r?\n/);
  let currentKey: string | null = null;
  let currentValue = "";

  const flush = () => {
    if (!currentKey) return;
    map.set(currentKey.toLowerCase(), currentValue.trim());
    currentKey = null;
    currentValue = "";
  };

  for (const line of lines) {
    if (!line.trim()) continue;
    if (/^\s/.test(line) && currentKey) {
      currentValue += ` ${line.trim()}`;
      continue;
    }
    flush();
    const separator = line.indexOf(":");
    if (separator <= 0) continue;
    currentKey = line.slice(0, separator).trim();
    currentValue = line.slice(separator + 1).trim();
  }
  flush();

  return map;
};

export const analyzeHeaders = (rawHeaders: string): HeaderAnalysis => {
  if (!rawHeaders.trim()) {
    return {
      riskScore: 0,
      reasons: [],
      signals: [],
      extracted: {
        fromDomain: null,
        returnPathDomain: null,
        replyToDomain: null,
        senderDomain: null,
      },
    };
  }

  const headers = parseHeaders(rawHeaders);
  const from = headers.get("from") ?? null;
  const returnPath = headers.get("return-path") ?? null;
  const replyTo = headers.get("reply-to") ?? null;
  const sender = headers.get("sender") ?? null;
  const authResults = `${headers.get("authentication-results") ?? ""} ${headers.get("received-spf") ?? ""}`.toLowerCase();

  const extracted = {
    fromDomain: extractDomainFromEmail(from),
    returnPathDomain: extractDomainFromEmail(returnPath),
    replyToDomain: extractDomainFromEmail(replyTo),
    senderDomain: extractDomainFromEmail(sender),
  };

  const signals: HeaderSignal[] = [];
  let score = 0;

  if (extracted.fromDomain && extracted.returnPathDomain && extracted.fromDomain !== extracted.returnPathDomain) {
    signals.push({
      code: "from-return-path-mismatch",
      message: "From domain does not match Return-Path domain.",
      weight: 28,
    });
    score += 28;
  }
  if (extracted.fromDomain && extracted.replyToDomain && extracted.fromDomain !== extracted.replyToDomain) {
    signals.push({
      code: "from-reply-to-mismatch",
      message: "From domain does not match Reply-To domain.",
      weight: 24,
    });
    score += 24;
  }
  if (authResults.includes("spf=fail") || authResults.includes("received-spf: fail") || authResults.includes("spf fail")) {
    signals.push({
      code: "spf-fail",
      message: "SPF validation indicates sender alignment failure.",
      weight: 22,
    });
    score += 22;
  }
  if (authResults.includes("dkim=fail")) {
    signals.push({
      code: "dkim-fail",
      message: "DKIM validation failed.",
      weight: 18,
    });
    score += 18;
  }
  if (authResults.includes("dmarc=fail")) {
    signals.push({
      code: "dmarc-fail",
      message: "DMARC policy alignment failed.",
      weight: 20,
    });
    score += 20;
  }

  return {
    riskScore: clamp(score),
    reasons: signals.map((signal) => signal.message),
    signals: signals.sort((a, b) => b.weight - a.weight),
    extracted,
  };
};
