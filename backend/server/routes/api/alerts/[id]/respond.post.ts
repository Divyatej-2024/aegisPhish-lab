import prisma from "@aegisPhish-lab/db";
import { createError, getRouterParam, readBody } from "h3";

import { assertValidStatusTransition, incidentResponseSchema } from "../../../../incidents/response";
import { requireFirebaseUser } from "../../../../utils/require-firebase-user";

type TimelineEntry = {
  action: string;
  timestamp: string;
  performed_by: string;
};

export default defineEventHandler(async (event) => {
  const user = await requireFirebaseUser(event);
  const alertId = getRouterParam(event, "id");
  if (!alertId) {
    throw createError({ statusCode: 400, statusMessage: "Alert id is required." });
  }

  const payload = await readBody(event);
  const parsed = incidentResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: parsed.error.issues[0]?.message ?? "Invalid response payload." });
  }

  const alert = await prisma.alert.findUnique({ where: { id: alertId } });
  if (!alert) {
    throw createError({ statusCode: 404, statusMessage: "Alert not found." });
  }

  assertValidStatusTransition(alert.status, parsed.data.status);

  const timelineEntry: TimelineEntry = {
    action: parsed.data.action,
    timestamp: new Date().toISOString(),
    performed_by: user.email ?? user.uid,
  };

  const existingActions = Array.isArray(alert.actionsTaken) ? alert.actionsTaken : [];
  const updatedActions = [...existingActions, timelineEntry];

  const updated = await prisma.alert.update({
    where: { id: alertId },
    data: {
      status: parsed.data.status,
      actionsTaken: updatedActions,
    },
  });

  return {
    alert: updated,
    timeline_entry: timelineEntry,
  };
});
