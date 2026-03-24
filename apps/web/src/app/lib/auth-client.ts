import { createAuthClient } from "better-auth/client";
import { adminClient, twoFactorClient } from "better-auth/client/plugins";
import { env } from "@aegisPhish-lab/env/web";

export const authClient = createAuthClient({
  baseURL: env.VITE_SERVER_URL,
  basePath: "/api/auth",
  plugins: [twoFactorClient(), adminClient()],
});
