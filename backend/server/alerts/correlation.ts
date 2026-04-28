import prisma from "@aegisPhish-lab/db";

import { buildCorrelationId } from "./generateAlert";

const CORRELATION_WINDOW_MINUTES = 15;
const ESCALATION_THRESHOLD = 2;

export const applyCorrelationRules = async (params: {
  userId?: string;
  source: string;
  predictionLabel: "phishing" | "legit";
  confidence: number;
}) => {
  if (!params.userId || params.predictionLabel !== "phishing" || params.confidence < 0.5) {
    return { escalateToHigh: false, correlationId: undefined as string | undefined, previousMatches: 0 };
  }

  const since = new Date(Date.now() - CORRELATION_WINDOW_MINUTES * 60 * 1000);
  const previousMatches = await prisma.alert.count({
    where: {
      userId: params.userId,
      eventType: "phishing_detection",
      timestamp: { gte: since },
      confidence: { gte: 0.5 },
    },
  });

  const correlationId = buildCorrelationId(params.userId, params.source, new Date());
  return {
    correlationId,
    previousMatches,
    escalateToHigh: previousMatches >= ESCALATION_THRESHOLD,
  };
};
