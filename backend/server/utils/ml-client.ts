type MlPrediction = {
  label: "phishing" | "legit";
  confidence: number;
  probabilities: {
    phishing: number;
    legit: number;
  };
  reasons: {
    code: string;
    message: string;
    evidence?: string;
    weight: number;
  }[];
  model?: string;
  source: "ml-server" | "heuristic";
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const KNOWN_SIGNALS: Array<{
  code: string;
  signal: string;
  weight: number;
  message: string;
}> = [
  { code: "urgency", signal: "urgent", weight: 0.08, message: "Urgency language increases pressure on the victim." },
  {
    code: "immediate-action",
    signal: "immediately",
    weight: 0.08,
    message: "Immediate action language is common in phishing campaigns.",
  },
  { code: "verify-request", signal: "verify", weight: 0.07, message: "Verification requests often target credential theft." },
  { code: "password", signal: "password", weight: 0.08, message: "Password references indicate account takeover attempts." },
  { code: "wire-transfer", signal: "wire", weight: 0.1, message: "Wire transfer requests are common in BEC attacks." },
  { code: "invoice", signal: "invoice", weight: 0.07, message: "Invoice language appears in payment fraud campaigns." },
  { code: "reset", signal: "reset", weight: 0.07, message: "Reset requests can be used to hijack credentials." },
  { code: "login", signal: "login", weight: 0.08, message: "Login prompts are a frequent phishing lure." },
  { code: "click-link", signal: "click", weight: 0.06, message: "Calls-to-action to click links are phishing indicators." },
  { code: "mfa", signal: "mfa", weight: 0.06, message: "MFA prompts may indicate fake account security alerts." },
  { code: "payment", signal: "payment", weight: 0.08, message: "Payment-related content can indicate financial phishing." },
  { code: "bank", signal: "bank", weight: 0.08, message: "Bank references are frequently abused by threat actors." },
  { code: "suspended", signal: "suspended", weight: 0.08, message: "Account suspension threats are social engineering signals." },
  {
    code: "security-alert",
    signal: "security alert",
    weight: 0.08,
    message: "Security alert phrasing is frequently spoofed by phishers.",
  },
];

const heuristicScore = (text: string) => {
  const lowered = text.toLowerCase();
  let score = 0.1;
  const reasons: MlPrediction["reasons"] = [];

  for (const item of KNOWN_SIGNALS) {
    if (lowered.includes(item.signal)) {
      score += item.weight;
      reasons.push({
        code: item.code,
        message: item.message,
        evidence: item.signal,
        weight: item.weight,
      });
    }
  }

  if (lowered.includes("http://")) {
    score += 0.2;
    reasons.push({
      code: "unsafe-http-link",
      message: "Unsafe HTTP links can expose credentials through insecure transport.",
      evidence: "http://",
      weight: 0.2,
    });
  }
  if (lowered.includes("bit.ly") || lowered.includes("tinyurl") || lowered.includes("t.co")) {
    score += 0.15;
    reasons.push({
      code: "link-shortener",
      message: "Link shorteners can hide malicious destinations.",
      evidence: "shortened-link",
      weight: 0.15,
    });
  }

  const finalScore = clamp(score);
  if (!reasons.length) {
    reasons.push({
      code: "low-signal",
      message: "No strong phishing signals found in heuristic analysis.",
      weight: 0,
    });
  }

  return {
    phishing: finalScore,
    reasons: reasons.sort((a, b) => b.weight - a.weight).slice(0, 6),
  };
};

export const predictPhishing = async (text: string): Promise<MlPrediction> => {
  const endpoint = process.env.ML_SERVER_URL;
  if (endpoint) {
    try {
      const response = await fetch(`${endpoint.replace(/\/$/, "")}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        const payload = (await response.json()) as any;
        const phishing = typeof payload?.phishing === "number" ? payload.phishing : payload?.probabilities?.phishing;
        const legit = typeof payload?.legit === "number" ? payload.legit : payload?.probabilities?.legit;
        const confidence =
          typeof payload?.confidence === "number"
            ? payload.confidence
            : typeof phishing === "number"
              ? phishing
              : 0.5;
        const reasons = Array.isArray(payload?.reasons)
          ? payload.reasons
              .map((reason: any) => ({
                code: typeof reason?.code === "string" ? reason.code : "model-signal",
                message:
                  typeof reason?.message === "string"
                    ? reason.message
                    : "External model returned a phishing indicator.",
                evidence: typeof reason?.evidence === "string" ? reason.evidence : undefined,
                weight: clamp(typeof reason?.weight === "number" ? reason.weight : confidence),
              }))
              .slice(0, 6)
          : [];

        return {
          label: payload?.label === "legit" ? "legit" : "phishing",
          confidence: clamp(confidence),
          probabilities: {
            phishing: clamp(typeof phishing === "number" ? phishing : confidence),
            legit: clamp(typeof legit === "number" ? legit : 1 - confidence),
          },
          reasons,
          model: payload?.model ?? "external",
          source: "ml-server",
        };
      }
    } catch {
      // fall back to heuristic
    }
  }

  const { phishing, reasons } = heuristicScore(text);
  return {
    label: phishing >= 0.5 ? "phishing" : "legit",
    confidence: clamp(phishing),
    probabilities: {
      phishing,
      legit: clamp(1 - phishing),
    },
    reasons,
    model: "heuristic-v1",
    source: "heuristic",
  };
};
