import { requireFirebaseUser } from "../../../utils/require-firebase-user";

export default defineEventHandler(async (event) => {
  const user = await requireFirebaseUser(event);

  return {
    profile: {
      uid: user.uid,
      email: user.email ?? null,
      name: user.name ?? user.displayName ?? null,
      role: (user as any).role ?? (user as any).admin ? "admin" : "user",
    },
  };
});
