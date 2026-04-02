type MlPrediction = {
  label: "phishing" | "legit";
  confidence: number;
  probabilities: {
    phishing: number;
    legit: number;
  };
  model?: string;
  source: "ml-server" | "heuristic";
};

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const heuristicScore = (text: string) => {
  const lowered = text.toLowerCase();
  const signals = [
    "urgent",
    "immediately",
    "verify",
    "password",
    "wire",
    "invoice",
    "reset",
    "login",
    "click",
    "mfa",
    "payment",
    "bank",
    "suspended",
    "security alert",
  ];

  let score = 0.1;
  for (const signal of signals) {
    if (lowered.includes(signal)) score += 0.07;
  }

  if (lowered.includes("http://")) score += 0.2;
  if (lowered.includes("http://") || lowered.includes("bit.ly")) score += 0.15;

  return clamp(score);
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

        return {
          label: payload?.label === "legit" ? "legit" : "phishing",
          confidence: clamp(confidence),
          probabilities: {
            phishing: clamp(typeof phishing === "number" ? phishing : confidence),
            legit: clamp(typeof legit === "number" ? legit : 1 - confidence),
          },
          model: payload?.model ?? "external",
          source: "ml-server",
        };
      }
    } catch {
      // fall back to heuristic
    }
  }

  const phishing = heuristicScore(text);
  return {
    label: phishing >= 0.5 ? "phishing" : "legit",
    confidence: clamp(phishing),
    probabilities: {
      phishing,
      legit: clamp(1 - phishing),
    },
    model: "heuristic-v1",
    source: "heuristic",
  };
};
