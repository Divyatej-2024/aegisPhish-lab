import { createError, readBody } from "h3";
import prisma from "@aegisPhish-lab/db";
import { z } from "zod";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";
import { ensureSimLevels } from "../../../utils/sim-levels";

export default defineEventHandler(async (event) => {
  const user = await requireFirebaseUser(event);
  await ensureSimLevels();

  const body = await readBody(event);
  const parsed = z
    .object({
      slug: z.string().trim().min(1, "Level slug is required."),
    })
    .safeParse(body);

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message ?? "Invalid request body." });
  }
  const slug = parsed.data.slug;

  const level = await prisma.simLevel.findUnique({ where: { slug } });
  if (!level) {
    throw createError({ statusCode: 404, statusMessage: "Level not found." });
  }

  const run = await prisma.simRun.create({
    data: {
      levelId: level.id,
      userId: user.uid,
      status: "in_progress",
    },
  });

  return {
    run: {
      id: run.id,
      levelId: run.levelId,
      status: run.status,
      score: run.score,
      startedAt: run.startedAt,
    },
    level: level.content,
  };
});
