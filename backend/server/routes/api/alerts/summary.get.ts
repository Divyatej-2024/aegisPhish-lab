import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event, { requireAdmin: true });

  const [totalAlerts, bySeverity, recentIncidents] = await Promise.all([
    prisma.alert.count(),
    prisma.alert.groupBy({
      by: ["severity"],
      _count: { _all: true },
    }),
    prisma.alert.findMany({
      orderBy: { timestamp: "desc" },
      take: 10,
      select: {
        id: true,
        timestamp: true,
        severity: true,
        status: true,
        source: true,
        confidence: true,
        correlationId: true,
      },
    }),
  ]);

  return {
    totalAlerts,
    alertsBySeverity: bySeverity.reduce<Record<string, number>>((acc, row) => {
      acc[row.severity] = row._count._all;
      return acc;
    }, {}),
    recentIncidents,
  };
});
