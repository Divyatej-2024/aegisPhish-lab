import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";

export default defineEventHandler(async (event) => {
  const user = await requireFirebaseUser(event);

  const [simRuns, labRuns, ctfSubmissions] = await Promise.all([
    prisma.simRun.findMany({
      where: { userId: user.uid },
      orderBy: { startedAt: "desc" },
      take: 10,
      include: { level: true },
    }),
    prisma.labRun.findMany({
      where: { userId: user.uid },
      orderBy: { startedAt: "desc" },
      take: 10,
      include: { scenario: true },
    }),
    prisma.ctfSubmission.findMany({
      where: { userId: user.uid },
      orderBy: { submittedAt: "desc" },
      take: 10,
      include: { challenge: true },
    }),
  ]);

  return {
    history: {
      simRuns: simRuns.map((run) => ({
        id: run.id,
        status: run.status,
        score: run.score,
        startedAt: run.startedAt,
        completedAt: run.completedAt,
        level: run.level
          ? {
              slug: run.level.slug,
              title: run.level.title,
              category: run.level.category,
              difficulty: run.level.difficulty,
            }
          : null,
      })),
      labRuns: labRuns.map((run) => ({
        id: run.id,
        status: run.status,
        score: run.score,
        startedAt: run.startedAt,
        completedAt: run.completedAt,
        scenario: run.scenario
          ? {
              slug: run.scenario.slug,
              title: run.scenario.title,
              category: run.scenario.category,
              difficulty: run.scenario.difficulty,
            }
          : null,
      })),
      ctfSubmissions: ctfSubmissions.map((sub) => ({
        id: sub.id,
        correct: sub.correct,
        submittedAt: sub.submittedAt,
        challenge: sub.challenge
          ? {
              slug: sub.challenge.slug,
              title: sub.challenge.title,
              category: sub.challenge.category,
              points: sub.challenge.points,
            }
          : null,
      })),
    },
  };
});
