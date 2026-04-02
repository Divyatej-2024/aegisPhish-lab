import { createError, readBody } from "h3";
import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../../../utils/require-firebase-user";
import { scoreScenario } from "../../../../../utils/lab-scenarios";

export default defineEventHandler(async (event) => {
  const user = await requireFirebaseUser(event);
  const id = event.context.params?.id;

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Run id is required." });
  }

  const run = await prisma.labRun.findUnique({
    where: { id },
    include: { scenario: true },
  });

  if (!run || run.userId !== user.uid) {
    throw createError({ statusCode: 404, statusMessage: "Run not found." });
  }

  const body = await readBody(event);
  const answers = Array.isArray(body?.answers) ? body.answers.map((value) => Number(value)) : [];

  const result = scoreScenario(run.scenario.steps as any, answers);

  const updated = await prisma.labRun.update({
    where: { id },
    data: {
      status: "completed",
      score: result.score,
      answers: {
        answers,
        graded: result.graded,
        total: result.total,
      },
      completedAt: new Date(),
    },
  });

  return {
    run: {
      id: updated.id,
      status: updated.status,
      score: updated.score,
      answers: updated.answers,
      completedAt: updated.completedAt,
    },
    result,
  };
});
