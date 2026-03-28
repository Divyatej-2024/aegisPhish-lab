import { createError, getRouterParam, readBody } from "h3";

import { adminAuth } from "../../../../utils/firebase-admin";
import { requireFirebaseUser } from "../../../../utils/require-firebase-user";

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event, { requireAdmin: true });

  const uid = getRouterParam(event, "uid");
  if (!uid) {
    throw createError({ statusCode: 400, statusMessage: "User id is required." });
  }

  const body = await readBody(event);
  const role = typeof body?.role === "string" ? body.role.trim() : undefined;
  const admin = typeof body?.admin === "boolean" ? body.admin : undefined;
  const disabled = typeof body?.disabled === "boolean" ? body.disabled : undefined;
  const displayName = typeof body?.displayName === "string" ? body.displayName.trim() : undefined;

  const user = await adminAuth.getUser(uid);
  const nextClaims: Record<string, unknown> = { ...(user.customClaims ?? {}) };

  if (typeof admin === "boolean") {
    if (admin) nextClaims.admin = true;
    else delete nextClaims.admin;
  }

  if (typeof role === "string") {
    if (role) nextClaims.role = role;
    else delete nextClaims.role;
  }

  if (Object.keys(nextClaims).length > 0) {
    await adminAuth.setCustomUserClaims(uid, nextClaims);
  } else if (user.customClaims && Object.keys(user.customClaims).length > 0) {
    await adminAuth.setCustomUserClaims(uid, {});
  }

  if (typeof disabled === "boolean" || typeof displayName === "string") {
    await adminAuth.updateUser(uid, {
      disabled,
      displayName,
    });
  }

  const updated = await adminAuth.getUser(uid);

  return {
    uid: updated.uid,
    email: updated.email,
    name: updated.displayName,
    admin: updated.customClaims?.admin === true,
    role: updated.customClaims?.role ?? (updated.customClaims?.admin ? "admin" : "user"),
    banned: updated.disabled === true,
  };
});
