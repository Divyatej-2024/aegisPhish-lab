import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event, { requireAdmin: true });

  const [
    userCount,
    campaignCount,
    eventCount,
    labRunCount,
    simRunCount,
    ctfSubmissionCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.phishCampaign.count(),
    prisma.phishEvent.count(),
    prisma.labRun.count(),
    prisma.simRun.count(),
    prisma.ctfSubmission.count(),
  ]);

  return {
    summary: {
      users: userCount,
      campaigns: campaignCount,
      phishEvents: eventCount,
      labRuns: labRunCount,
      simRuns: simRunCount,
      ctfSubmissions: ctfSubmissionCount,
    },
  };
});
