import { createError, readBody } from "h3";

import { adminAuth } from "../../../utils/firebase-admin";
import { requireFirebaseUser } from "../../../utils/require-firebase-user";

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event, { requireAdmin: true });

  const body = await readBody(event);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const displayName = typeof body?.displayName === "string" ? body.displayName.trim() : "";
  const role = typeof body?.role === "string" ? body.role.trim() : "";
  const admin = body?.admin === true;

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: "Email and password are required." });
  }

  const user = await adminAuth.createUser({
    email,
    password,
    displayName: displayName || undefined,
  });

  const claims: Record<string, unknown> = {};
  if (role) claims.role = role;
  if (admin) claims.admin = true;
  if (Object.keys(claims).length > 0) {
    await adminAuth.setCustomUserClaims(user.uid, claims);
  }

  return {
    uid: user.uid,
    email: user.email,
    name: user.displayName,
    admin,
    role: role || (admin ? "admin" : "user"),
  };
});
