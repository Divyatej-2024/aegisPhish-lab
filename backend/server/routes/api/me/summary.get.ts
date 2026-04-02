import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";

export default defineEventHandler(async (event) => {
  const user = await requireFirebaseUser(event);

  const [simRuns, labRuns, ctfSubmissions] = await Promise.all([
    prisma.simRun.findMany({ where: { userId: user.uid } }),
    prisma.labRun.findMany({ where: { userId: user.uid } }),
    prisma.ctfSubmission.findMany({ where: { userId: user.uid } }),
  ]);

  const lastSim = simRuns.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];
  const lastLab = labRuns.sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())[0];
  const lastCtf = ctfSubmissions
    .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())[0];

  return {
    summary: {
      simRuns: simRuns.length,
      labRuns: labRuns.length,
      ctfSubmissions: ctfSubmissions.length,
      lastActivity:
        lastSim?.startedAt ?? lastLab?.startedAt ?? lastCtf?.submittedAt ?? null,
      latestSimScore:
        typeof lastSim?.score === "number" ? lastSim.score : null,
    },
  };
});
