import { createError, readBody } from "h3";
import prisma from "@aegisPhish-lab/db";
import { z } from "zod";

import { requireFirebaseUser } from "../../../../../utils/require-firebase-user";
import { predictPhishing } from "../../../../../utils/ml-client";
import { scoreAction } from "../../../../../utils/sim-levels";

export default defineEventHandler(async (event) => {
  const user = await requireFirebaseUser(event);
  const id = event.context.params?.id;

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Run id is required." });
  }

  const run = await prisma.simRun.findUnique({
    where: { id },
    include: { level: true },
  });

  if (!run || run.userId !== user.uid) {
    throw createError({ statusCode: 404, statusMessage: "Run not found." });
  }
  if (run.status === "completed") {
    throw createError({ statusCode: 409, statusMessage: "Run is already completed." });
  }

  const body = await readBody(event);
  const parsed = z
    .object({
      stepIndex: z.coerce.number().int().min(0),
      type: z.string().trim().min(1, "Action type is required."),
      label: z.string().trim().optional(),
      note: z.string().trim().optional(),
    })
    .safeParse(body);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message ?? "Invalid request body." });
  }
  const { stepIndex, type, label, note: userNote } = parsed.data;

  const levelContent = run.level.content as any;
  const step = levelContent?.steps?.[stepIndex];
  if (!step) {
    throw createError({ statusCode: 400, statusMessage: "Invalid step." });
  }
  const allowed = Array.isArray(step?.actions)
    ? step.actions.some((action: any) => action?.type === type)
    : false;
  if (!allowed) {
    throw createError({ statusCode: 400, statusMessage: "Invalid action type for this step." });
  }

  const existing = await prisma.simAction.findFirst({
    where: {
      runId: run.id,
      stepIndex,
    },
    orderBy: { createdAt: "desc" },
  });
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: "Step already submitted for this run." });
  }

  const predictionInput = [
    step?.email?.from,
    step?.email?.replyTo,
    step?.email?.subject,
    step?.email?.body,
    step?.email?.linkText,
    step?.email?.linkUrl,
    Array.isArray(step?.email?.attachments) ? step.email.attachments.join(" ") : "",
  ]
    .filter((value) => typeof value === "string" && value.length > 0)
    .join("\n");

  const prediction = await predictPhishing(predictionInput);
  const scoring = scoreAction(type, levelContent, stepIndex);

  const action = await prisma.simAction.create({
    data: {
      runId: run.id,
      stepIndex,
      type,
      label: label || null,
      score: scoring.score,
      metadata: {
        note: userNote || null,
        prediction,
        feedback: scoring.feedback,
      },
    },
  });

  const updated = await prisma.simRun.update({
    where: { id: run.id },
    data: {
      score: run.score + scoring.score,
      status: stepIndex >= (levelContent?.steps?.length ?? 1) - 1 ? "completed" : run.status,
      completedAt: stepIndex >= (levelContent?.steps?.length ?? 1) - 1 ? new Date() : run.completedAt,
    },
  });

  return {
    action: {
      id: action.id,
      type: action.type,
      score: action.score,
      feedback: scoring.feedback,
      prediction,
    },
    run: {
      id: updated.id,
      score: updated.score,
    },
  };
});
