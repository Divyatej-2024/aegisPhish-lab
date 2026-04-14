import { createError, readBody } from "h3";
import { z } from "zod";

import { analyzeHeaders } from "../../utils/header-analyzer";
import { predictPhishing } from "../../utils/ml-client";
import { requireFirebaseUser } from "../../utils/require-firebase-user";
import { buildThreatScore } from "../../utils/threat-scoring";
import { analyzeUrls } from "../../utils/url-analyzer";

const analyzeSchema = z.object({
  text: z.string().optional().default(""),
  url: z.string().optional().default(""),
  headers: z.string().optional().default(""),
});

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event);

  const body = await readBody(event);
  const parsed = analyzeSchema.safeParse(body);

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message ?? "Invalid request body." });
  }

  const text = parsed.data.text.trim();
  const url = parsed.data.url.trim();
  const headers = parsed.data.headers.trim();

  if (!text && !url && !headers) {
    throw createError({ statusCode: 400, statusMessage: "Provide at least one input: text, url, or headers." });
  }

  const modelInput = [text, url, headers].filter(Boolean).join("\n");
  const prediction = await predictPhishing(modelInput);
  const urlAnalysis = analyzeUrls({ text, url });
  const headerAnalysis = analyzeHeaders(headers);
  const threat = buildThreatScore({
    prediction,
    urlAnalysis,
    headerAnalysis,
  });

  return {
    prediction: prediction.label,
    confidence: Number(prediction.confidence.toFixed(4)),
    riskScore: threat.riskScore,
    riskLevel: threat.riskLevel,
    reasons: threat.reasons,
    iocs: threat.iocs,
    details: {
      probabilities: prediction.probabilities,
      model: prediction.model,
      source: prediction.source,
      url: urlAnalysis,
      headers: headerAnalysis,
    },
  };
});
