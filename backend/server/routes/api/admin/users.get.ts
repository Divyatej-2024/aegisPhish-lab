import { getQuery } from "h3";

import { adminAuth } from "../../../utils/firebase-admin";
import { requireFirebaseUser } from "../../../utils/require-firebase-user";

export default defineEventHandler(async (event) => {
  await requireFirebaseUser(event, { requireAdmin: true });

  const query = getQuery(event);
  const limit = Math.min(Number(query.limit ?? 20), 100);

  const { users } = await adminAuth.listUsers(limit);

  return {
    users: users.map((user) => ({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      role: user.customClaims?.role ?? (user.customClaims?.admin ? "admin" : "user"),
      banned: user.disabled === true,
    })),
  };
});
