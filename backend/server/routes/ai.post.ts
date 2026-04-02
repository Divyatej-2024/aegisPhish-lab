import { readBody } from "h3";

import { predictPhishing } from "../utils/ml-client";
import { requireFirebaseUser } from "../utils/require-firebase-user";

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event);
  const body = await readBody(event);
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  const prediction = await predictPhishing(text);

  return {
    prediction,
  };
});
