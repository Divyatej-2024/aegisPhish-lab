import { createError } from "h3";
import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../../utils/require-firebase-user";

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event, { requireAdmin: true });

  const id = event.context.params?.id;
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Campaign id is required." });
  }

  const campaign = await prisma.phishCampaign.findUnique({
    where: { id },
  });

  if (!campaign) {
    throw createError({ statusCode: 404, statusMessage: "Campaign not found." });
  }

  const [targets, events] = await Promise.all([
    prisma.phishTarget.findMany({
      where: { campaignId: id },
      orderBy: { createdAt: "asc" },
    }),
    prisma.phishEvent.findMany({
      where: { campaignId: id },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  ]);

  return { campaign, targets, events };
});
