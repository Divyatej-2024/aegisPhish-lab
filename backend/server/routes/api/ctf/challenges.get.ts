import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";
import { ensureCtfChallenges } from "../../../utils/ctf";

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event);
  await ensureCtfChallenges();

  const challenges = await prisma.ctfChallenge.findMany({
    orderBy: { points: "asc" },
    select: {
      slug: true,
      title: true,
      description: true,
      hint: true,
      category: true,
      points: true,
    },
  });

  return { challenges };
});
