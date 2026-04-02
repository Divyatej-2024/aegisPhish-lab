import { createError, readBody } from "h3";
import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";
import { ensureLabScenarios } from "../../../utils/lab-scenarios";

export default defineEventHandler(async (event) => {
  const user = await requireFirebaseUser(event);
  await ensureLabScenarios();

  const body = await readBody(event);
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: "Scenario slug is required." });
  }

  const scenario = await prisma.labScenario.findUnique({ where: { slug } });
  if (!scenario) {
    throw createError({ statusCode: 404, statusMessage: "Scenario not found." });
  }

  const run = await prisma.labRun.create({
    data: {
      scenarioId: scenario.id,
      userId: user.uid,
      status: "in_progress",
    },
  });

  return {
    run: {
      id: run.id,
      scenarioId: run.scenarioId,
      status: run.status,
      startedAt: run.startedAt,
    },
    scenario: {
      slug: scenario.slug,
      title: scenario.title,
      summary: scenario.summary,
      category: scenario.category,
      difficulty: scenario.difficulty,
      estimatedMinutes: scenario.estimatedMinutes,
      tags: scenario.tags,
      type: scenario.type,
      steps: scenario.steps,
    },
  };
});
