import { createError, readBody } from "h3";

import prisma from "@aegisPhish-lab/db";

import { requireFirebaseUser } from "../../../utils/require-firebase-user";
import { ensureCtfChallenges, hashFlag } from "../../../utils/ctf";

export default defineEventHandler(async (event) => {
  const user = await requireFirebaseUser(event);
  await ensureCtfChallenges();

  const body = await readBody(event);
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
  const flag = typeof body?.flag === "string" ? body.flag.trim() : "";

  if (!slug || !flag) {
    throw createError({ statusCode: 400, statusMessage: "Challenge slug and flag are required." });
  }

  const challenge = await prisma.ctfChallenge.findUnique({ where: { slug } });
  if (!challenge) {
    throw createError({ statusCode: 404, statusMessage: "Challenge not found." });
  }

  const existingSolve = await prisma.ctfSubmission.findFirst({
    where: {
      userId: user.uid,
      challengeId: challenge.id,
      correct: true,
    },
  });

  if (existingSolve) {
    return { correct: true, alreadySolved: true };
  }

  const hashed = hashFlag(flag);
  const correct = hashed === challenge.flagHash;

  await prisma.ctfSubmission.create({
    data: {
      userId: user.uid,
      userName: user.name ?? user.email ?? "Operator",
      userEmail: user.email ?? null,
      challengeId: challenge.id,
      correct,
      flagHash: hashed,
    },
  });

  return { correct, alreadySolved: false };
});
