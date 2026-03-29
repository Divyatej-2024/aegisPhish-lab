import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";
import { ensureCtfChallenges } from "../../../utils/ctf";

type ScoreRow = {
  userId: string;
  name: string;
  score: number;
  solved: number;
  lastSolveAt: string | null;
};

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event);
  await ensureCtfChallenges();

  const submissions = await prisma.ctfSubmission.findMany({
    where: { correct: true },
    include: { challenge: true },
    orderBy: { submittedAt: "asc" },
  });

  const totals = new Map<string, { name: string; score: number; solved: Set<string>; lastSolveAt: Date | null }>();

  for (const submission of submissions) {
    const key = submission.userId;
    if (!totals.has(key)) {
      totals.set(key, {
        name: submission.userName ?? submission.userEmail ?? "Operator",
        score: 0,
        solved: new Set(),
        lastSolveAt: null,
      });
    }

    const entry = totals.get(key);
    if (!entry) continue;

    if (!entry.solved.has(submission.challengeId)) {
      entry.solved.add(submission.challengeId);
      entry.score += submission.challenge.points;
      entry.lastSolveAt = submission.submittedAt;
    }
  }

  const rows: ScoreRow[] = [...totals.entries()].map(([userId, entry]) => ({
    userId,
    name: entry.name,
    score: entry.score,
    solved: entry.solved.size,
    lastSolveAt: entry.lastSolveAt ? entry.lastSolveAt.toISOString() : null,
  }));

  rows.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (!a.lastSolveAt) return 1;
    if (!b.lastSolveAt) return -1;
    return a.lastSolveAt.localeCompare(b.lastSolveAt);
  });

  return { leaderboard: rows.slice(0, 25) };
});
