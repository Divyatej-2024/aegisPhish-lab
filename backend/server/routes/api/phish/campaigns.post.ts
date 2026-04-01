import { createError, readBody } from "h3";
import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";
import { generateToken, parseTargets } from "../../../utils/phish";

const normalizeStatus = (value: unknown) => {
  if (typeof value !== "string") return "draft";
  const trimmed = value.trim().toLowerCase();
  if (["draft", "active", "completed"].includes(trimmed)) return trimmed;
  return "draft";
};

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event, { requireAdmin: true });

  const body = await readBody(event);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const status = normalizeStatus(body?.status);
  const targets = parseTargets(body?.targets);

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: "Campaign name is required." });
  }

  const campaign = await prisma.phishCampaign.create({
    data: {
      name,
      description: description || null,
      status,
    },
  });

  const createdTargets =
    targets.length > 0
      ? await prisma.$transaction(
          targets.map((target) =>
            prisma.phishTarget.create({
              data: {
                campaignId: campaign.id,
                email: target.email,
                name: target.name ?? null,
                department: target.department ?? null,
                token: generateToken(),
              },
            }),
          ),
        )
      : [];

  return {
    campaign,
    targets: createdTargets,
  };
});
