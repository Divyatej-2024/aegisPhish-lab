import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { authClient } from "../lib/auth-client";

const hasAdminRole = (role: unknown): boolean => {
  if (Array.isArray(role)) return role.includes("admin");
  if (typeof role === "string") {
    return role === "admin" || role.split(",").map((value) => value.trim()).includes("admin");
  }
  return false;
};

export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);

  try {
    const { data } = await authClient.getSession();
    if (data && hasAdminRole((data as any).user?.role)) return true;
  } catch {
    // fall through to redirect
  }

  return router.parseUrl("/dashboard");
};
