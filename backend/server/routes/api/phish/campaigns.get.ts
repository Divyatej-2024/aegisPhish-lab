import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event, { requireAdmin: true });

  const campaigns = await prisma.phishCampaign.findMany({
    orderBy: { createdAt: "desc" },
  });

  const enriched = await Promise.all(
    campaigns.map(async (campaign) => {
      const [targetCount, clickCount, submitCount] = await Promise.all([
        prisma.phishTarget.count({ where: { campaignId: campaign.id } }),
        prisma.phishEvent.count({ where: { campaignId: campaign.id, type: "click" } }),
        prisma.phishEvent.count({ where: { campaignId: campaign.id, type: "submit" } }),
      ]);

      return {
        ...campaign,
        targetCount,
        clickCount,
        submitCount,
      };
    }),
  );

  return { campaigns: enriched };
});
