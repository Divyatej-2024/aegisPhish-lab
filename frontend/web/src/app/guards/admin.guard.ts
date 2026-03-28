import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { getCurrentUser, isAdminUser } from "../lib/firebase-auth";

export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);

  const user = await getCurrentUser();
  if (!user) return router.parseUrl("/admin/login");

  // Compliance: enforce admin access via Firebase custom claims.
  if (await isAdminUser()) return true;

  return router.parseUrl("/dashboard");
};
