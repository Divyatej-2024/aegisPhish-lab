import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";
import { ensureLabScenarios } from "../../../utils/lab-scenarios";

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event);
  await ensureLabScenarios();

  const scenarios = await prisma.labScenario.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      category: true,
      difficulty: true,
      estimatedMinutes: true,
      tags: true,
      type: true,
    },
  });

  return { scenarios };
});
