import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";
import { ensureSimLevels } from "../../../utils/sim-levels";

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event);
  await ensureSimLevels();

  const levels = await prisma.simLevel.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      category: true,
      difficulty: true,
      order: true,
    },
  });

  return { levels };
});
