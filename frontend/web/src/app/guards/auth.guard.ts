import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { authClient } from "../lib/auth-client";

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);

  try {
    const { data } = await authClient.getSession();
    if (data?.user) return true;
  } catch {
    // fall through to redirect
  }

  return router.parseUrl("/");
};
