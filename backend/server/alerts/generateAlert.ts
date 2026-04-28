import { createHash, randomUUID } from "node:crypto";

export type DetectionReason = {
  code: string;
  message: string;
  evidence?: string;
  weight: number;
};

export type DetectionResult = {
  label: "phishing" | "legit";
  confidence: number;
  reasons: DetectionReason[];
};

export type AlertSeverity = "LOW" | "MEDIUM" | "HIGH";

export type SocAlert = {
  id: string;
  timestamp: string;
  event_type: "phishing_detection";
  severity: AlertSeverity;
  source: string;
  user?: string;
  description: string;
  confidence: number;
  reasons: DetectionReason[];
  recommended_action: string;
  mitre_technique: "T1566" | "T1566.001" | "T1566.002";
  correlation_id?: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
  actions_taken: Array<{
    action: string;
    timestamp: string;
    performed_by: string;
  }>;
};

const CREDENTIAL_OR_FINANCIAL_KEYWORDS = [
  "credential",
  "password",
  "login",
  "bank",
  "invoice",
  "wire",
  "payment",
  "financial",
  "account",
  "reset",
];

const hasCredentialOrFinancialSignal = (detection: DetectionResult) => {
  const reasonText = detection.reasons
    .map((reason) => `${reason.code} ${reason.message} ${reason.evidence ?? ""}`.toLowerCase())
    .join(" ");

  return CREDENTIAL_OR_FINANCIAL_KEYWORDS.some((keyword) => reasonText.includes(keyword));
};

const resolveSeverity = (detection: DetectionResult): AlertSeverity => {
  if (detection.confidence > 0.8 && hasCredentialOrFinancialSignal(detection)) {
    return "HIGH";
  }
  if (detection.confidence >= 0.5 && detection.confidence <= 0.8) {
    return "MEDIUM";
  }
  return "LOW";
};

const resolveRecommendedAction = (severity: AlertSeverity) => {
  if (severity === "HIGH") return "block sender, reset credentials, notify SOC";
  if (severity === "MEDIUM") return "flag email, notify user";
  return "log only";
};

const resolveMitreTechnique = (source: string): SocAlert["mitre_technique"] => {
  const lowered = source.toLowerCase();
  if (lowered.includes("http://") || lowered.includes("https://") || lowered.includes("www.")) {
    return "T1566.002";
  }
  if (lowered.endsWith(".zip") || lowered.endsWith(".pdf") || lowered.endsWith(".doc") || lowered.endsWith(".docx")) {
    return "T1566.001";
  }
  return "T1566";
};

export const buildCorrelationId = (userId: string, source: string, timestamp: Date) => {
  const window = new Date(timestamp);
  window.setUTCMinutes(Math.floor(window.getUTCMinutes() / 15) * 15, 0, 0);
  const fingerprint = `${userId}|${source.toLowerCase()}|${window.toISOString()}`;
  return createHash("sha256").update(fingerprint).digest("hex").slice(0, 24);
};

export const generateAlert = (params: {
  detection: DetectionResult;
  source: string;
  user?: string;
  correlationId?: string;
  forceSeverity?: AlertSeverity;
}): SocAlert => {
  const now = new Date();
  const severity = params.forceSeverity ?? resolveSeverity(params.detection);

  return {
    id: randomUUID(),
    timestamp: now.toISOString(),
    event_type: "phishing_detection",
    severity,
    source: params.source,
    user: params.user,
    description:
      params.detection.label === "phishing"
        ? "Potential phishing content detected by the analysis pipeline."
        : "Content analyzed with low phishing risk.",
    confidence: Number(params.detection.confidence.toFixed(4)),
    reasons: params.detection.reasons,
    recommended_action: resolveRecommendedAction(severity),
    mitre_technique: resolveMitreTechnique(params.source),
    correlation_id: params.correlationId,
    status: "OPEN",
    actions_taken: [],
  };
};
