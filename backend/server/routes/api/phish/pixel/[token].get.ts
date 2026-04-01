import { createError, setHeader } from "h3";
import prisma from "@aegisPhish-lab/db";

import { getRequestMeta } from "../../../../utils/phish";

const TRANSPARENT_GIF_BASE64 = "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

export default defineEventHandler(async (event) => {
  const token = event.context.params?.token;
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: "Missing token." });
  }

  const target = await prisma.phishTarget.findUnique({ where: { token } });
  if (!target) {
    throw createError({ statusCode: 404, statusMessage: "Invalid tracking token." });
  }

  const { ipAddress, userAgent } = getRequestMeta(event);

  await prisma.phishEvent.create({
    data: {
      campaignId: target.campaignId,
      targetId: target.id,
      type: "open",
      ipAddress,
      userAgent,
    },
  });

  setHeader(event, "Content-Type", "image/gif");
  setHeader(event, "Cache-Control", "no-store, max-age=0");

  return Buffer.from(TRANSPARENT_GIF_BASE64, "base64");
});
