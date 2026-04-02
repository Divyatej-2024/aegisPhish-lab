import { createError, readBody } from "h3";
import prisma from "@aegisPhish-lab/db";

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

  const body = await readBody(event);
  const stepIndex = Number(body?.stepIndex ?? 0);
  const type = typeof body?.type === "string" ? body.type.trim() : "";
  const label = typeof body?.label === "string" ? body.label.trim() : "";
  const userNote = typeof body?.note === "string" ? body.note.trim() : "";

  if (!type) {
    throw createError({ statusCode: 400, statusMessage: "Action type is required." });
  }

  const levelContent = run.level.content as any;
  const step = levelContent?.steps?.[stepIndex];
  if (!step) {
    throw createError({ statusCode: 400, statusMessage: "Invalid step." });
  }

  const prediction = await predictPhishing(step?.email?.body ?? "");
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
