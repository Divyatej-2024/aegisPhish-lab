import { createError } from "h3";
import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../../utils/require-firebase-user";

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

  return {
    run: {
      id: run.id,
      status: run.status,
      score: run.score,
      answers: run.answers,
      startedAt: run.startedAt,
      completedAt: run.completedAt,
    },
    scenario: {
      slug: run.scenario.slug,
      title: run.scenario.title,
      summary: run.scenario.summary,
      category: run.scenario.category,
      difficulty: run.scenario.difficulty,
      estimatedMinutes: run.scenario.estimatedMinutes,
      tags: run.scenario.tags,
      type: run.scenario.type,
      steps: run.scenario.steps,
    },
  };
});
