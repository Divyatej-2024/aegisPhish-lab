import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";
import { ensureCtfChallenges } from "../../../utils/ctf";

export default defineEventHandler(async (event) => {
  const user = await requireFirebaseUser(event);
  await ensureCtfChallenges();

  const submissions = await prisma.ctfSubmission.findMany({
    where: {
      userId: user.uid,
      correct: true,
    },
    include: {
      challenge: true,
    },
    orderBy: { submittedAt: "asc" },
  });

  const solvedByChallenge = new Map<string, { slug: string; points: number }>();
  for (const submission of submissions) {
    if (!solvedByChallenge.has(submission.challengeId)) {
      solvedByChallenge.set(submission.challengeId, {
        slug: submission.challenge.slug,
        points: submission.challenge.points,
      });
    }
  }

  const solvedSlugs = [...solvedByChallenge.values()].map((item) => item.slug);
  const totalPoints = [...solvedByChallenge.values()].reduce((sum, item) => sum + item.points, 0);

  return {
    solvedSlugs,
    solvedCount: solvedSlugs.length,
    totalPoints,
  };
});
