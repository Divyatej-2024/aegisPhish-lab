import { createError, readBody } from "h3";
import prisma from "@aegisPhish-lab/db";
import { z } from "zod";

import { applyCorrelationRules } from "../../alerts/correlation";
import { generateAlert } from "../../alerts/generateAlert";
import { logPhishingEvent } from "../../alerts/logger";
import { requireFirebaseUser } from "../../utils/require-firebase-user";
import { predictPhishing } from "../../utils/ml-client";

const predictSchema = z.object({
  text: z.string().min(1, "Text is required.").max(10000, "Text is too long."),
  source: z.string().trim().min(1).max(2048).optional(),
  sourceType: z.enum(["email", "url"]).optional(),
});

const extractSource = (text: string, explicitSource?: string) => {
  if (explicitSource) return explicitSource;

  const urlMatch = text.match(/https?:\/\/[^\s]+/i);
  if (urlMatch?.[0]) return urlMatch[0];

  return "email_content";
};

export default defineEventHandler(async (event) => {
  const user = await requireFirebaseUser(event);

  const body = await readBody(event);
  const parsed = predictSchema.safeParse(body);

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message ?? "Invalid request body." });
  }

  const text = parsed.data.text.trim();
  const source = extractSource(text, parsed.data.source);

  const prediction = await predictPhishing(text);
  const correlation = await applyCorrelationRules({
    userId: user.uid,
    source,
    predictionLabel: prediction.label,
    confidence: prediction.confidence,
  });

  const alert = generateAlert({
    detection: {
      label: prediction.label,
      confidence: prediction.confidence,
      reasons: prediction.reasons,
    },
    source,
    user: user.email ?? user.uid,
    correlationId: correlation.correlationId,
    forceSeverity: correlation.escalateToHigh ? "HIGH" : undefined,
  });

  await logPhishingEvent(alert);

  await prisma.alert.create({
    data: {
      id: alert.id,
      timestamp: new Date(alert.timestamp),
      severity: alert.severity,
      eventType: alert.event_type,
      userId: user.uid,
      user: alert.user ?? null,
      source: alert.source,
      description: alert.description,
      confidence: alert.confidence,
      reasons: alert.reasons,
      recommendedAction: alert.recommended_action,
      status: alert.status,
      actionsTaken: alert.actions_taken,
      correlationId: alert.correlation_id ?? null,
      mitreTechnique: alert.mitre_technique,
    },
  });

  return {
    prediction,
    alert,
  };
});
