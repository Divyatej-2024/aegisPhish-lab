import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event, { requireAdmin: true });

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [campaigns, targets, events, simRuns, labRuns] = await Promise.all([
    prisma.phishCampaign.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.phishTarget.findMany({ select: { id: true, email: true, campaignId: true } }),
    prisma.phishEvent.findMany({ where: { createdAt: { gte: since } } }),
    prisma.simRun.findMany({ where: { startedAt: { gte: since } } }),
    prisma.labRun.findMany({ where: { startedAt: { gte: since } } }),
  ]);

  const targetMap = new Map(targets.map((t) => [t.id, t.email]));

  const campaignStats = new Map<string, { opens: number; clicks: number; submits: number }>();
  const userRisk = new Map<string, number>();

  for (const eventItem of events) {
    const entry = campaignStats.get(eventItem.campaignId) ?? { opens: 0, clicks: 0, submits: 0 };
    if (eventItem.type === "open") entry.opens += 1;
    if (eventItem.type === "click") entry.clicks += 1;
    if (eventItem.type === "submit") entry.submits += 1;
    campaignStats.set(eventItem.campaignId, entry);

    if (eventItem.type === "click" || eventItem.type === "submit") {
      const email = eventItem.targetId ? targetMap.get(eventItem.targetId) : undefined;
      if (email) userRisk.set(email, (userRisk.get(email) ?? 0) + (eventItem.type === "submit" ? 2 : 1));
    }
  }

  const campaignRows = campaigns.map((campaign) => {
    const stats = campaignStats.get(campaign.id) ?? { opens: 0, clicks: 0, submits: 0 };
    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      opens: stats.opens,
      clicks: stats.clicks,
      submits: stats.submits,
    };
  });

  const riskyUsers = Array.from(userRisk.entries())
    .map(([email, score]) => ({ email, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    analytics: {
      timeframe: "7d",
      campaignRows,
      riskyUsers,
      simRuns: simRuns.length,
      labRuns: labRuns.length,
    },
  };
});
