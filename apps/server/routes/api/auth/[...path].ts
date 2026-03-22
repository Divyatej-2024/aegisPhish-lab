import { auth } from "@aegisPhish-lab/auth";
import { toNodeHandler } from "better-auth/node";

const authHandler = toNodeHandler(auth);

export default defineEventHandler(async (event) => {
  const { req, res } = event.node;
  await authHandler(req, res);
});
