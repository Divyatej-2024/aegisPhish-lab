import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { getCurrentUser } from "../lib/firebase-auth";

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);

  const user = await getCurrentUser();
  if (user) return true;

  return router.parseUrl("/login");
};
