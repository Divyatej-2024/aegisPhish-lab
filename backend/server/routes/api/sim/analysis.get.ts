import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";

export default defineEventHandler(async (event) => {
  const user = await requireFirebaseUser(event);

  const runs = await prisma.simRun.findMany({
    where: { userId: user.uid },
    include: { actions: true },
  });

  const totalRuns = runs.length;
  const totalActions = runs.reduce((sum, run) => sum + run.actions.length, 0);
  const totalScore = runs.reduce((sum, run) => sum + run.score, 0);

  let reportCount = 0;
  let clickCount = 0;
  let riskyCount = 0;
  runs.forEach((run) => {
    run.actions.forEach((action) => {
      if (action.type === "report") reportCount += 1;
      if (action.type === "click" || action.type === "download") clickCount += 1;
      if (action.score < 0) riskyCount += 1;
    });
  });

  return {
    summary: {
      totalRuns,
      totalActions,
      averageScore: totalRuns ? Number((totalScore / totalRuns).toFixed(2)) : 0,
      reportRate: totalActions ? Number(((reportCount / totalActions) * 100).toFixed(1)) : 0,
      riskyActionRate: totalActions ? Number(((riskyCount / totalActions) * 100).toFixed(1)) : 0,
      clickRate: totalActions ? Number(((clickCount / totalActions) * 100).toFixed(1)) : 0,
    },
  };
});
