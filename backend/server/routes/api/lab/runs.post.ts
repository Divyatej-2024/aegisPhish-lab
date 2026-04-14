import { createError, readBody } from "h3";
import prisma from "@aegisPhish-lab/db";
import { z } from "zod";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";
import { ensureLabScenarios } from "../../../utils/lab-scenarios";

export default defineEventHandler(async (event) => {
  const user = await requireFirebaseUser(event);
  await ensureLabScenarios();

  const body = await readBody(event);
  const parsed = z
    .object({
      slug: z.string().trim().min(1, "Scenario slug is required."),
    })
    .safeParse(body);

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message ?? "Invalid request body." });
  }
  const slug = parsed.data.slug;

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
