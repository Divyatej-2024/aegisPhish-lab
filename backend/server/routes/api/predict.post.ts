import { createError, readBody } from "h3";

import { requireFirebaseUser } from "../../utils/require-firebase-user";
import { predictPhishing } from "../../utils/ml-client";

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event);

  const body = await readBody(event);
  const text = typeof body?.text === "string" ? body.text.trim() : "";

  if (!text) {
    throw createError({ statusCode: 400, statusMessage: "Text is required." });
  }

  const prediction = await predictPhishing(text);
  return { prediction };
});
