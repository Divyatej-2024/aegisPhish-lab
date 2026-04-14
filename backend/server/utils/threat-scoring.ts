import type { HeaderAnalysis } from "./header-analyzer";
import type { UrlAnalysis } from "./url-analyzer";

type MlPrediction = {
  label: "phishing" | "legit";
  confidence: number;
  reasons: {
    message: string;
    evidence?: string;
  }[];
};

export type ThreatLevel = "low" | "medium" | "high" | "critical";

export type ThreatScoreResult = {
  riskScore: number;
  riskLevel: ThreatLevel;
  reasons: string[];
  iocs: {
    urls: string[];
    domains: string[];
    headerDomains: string[];
  };
};

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const getRiskLevel = (score: number): ThreatLevel => {
  if (score >= 80) return "critical";
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
};

export const buildThreatScore = (input: {
  prediction: MlPrediction;
  urlAnalysis: UrlAnalysis;
  headerAnalysis: HeaderAnalysis;
}): ThreatScoreResult => {
  const predictionWeight = input.prediction.label === "phishing" ? 0.58 : 0.38;
  const score = clamp(
    Math.round(
      input.prediction.confidence * 100 * predictionWeight
      + input.urlAnalysis.riskScore * 0.27
      + input.headerAnalysis.riskScore * 0.15,
    ),
  );

  const reasons = [
    ...input.prediction.reasons.map((reason) =>
      reason.evidence ? `${reason.message} (evidence: ${reason.evidence})` : reason.message),
    ...input.urlAnalysis.reasons,
    ...input.headerAnalysis.reasons,
  ];

  const headerDomains = [
    input.headerAnalysis.extracted.fromDomain,
    input.headerAnalysis.extracted.replyToDomain,
    input.headerAnalysis.extracted.returnPathDomain,
    input.headerAnalysis.extracted.senderDomain,
  ].filter((value): value is string => Boolean(value));

  return {
    riskScore: score,
    riskLevel: getRiskLevel(score),
    reasons: [...new Set(reasons)].slice(0, 10),
    iocs: {
      urls: input.urlAnalysis.iocs.urls,
      domains: [...new Set([...input.urlAnalysis.iocs.domains, ...headerDomains])],
      headerDomains: [...new Set(headerDomains)],
    },
  };
};
