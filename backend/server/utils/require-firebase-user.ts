import { createError, getHeader, H3Event } from "h3";

import { adminAuth } from "./firebase-admin";

const hasAdminClaim = (claims: Record<string, unknown>) => {
  if (claims["admin"] === true) return true;

  const role = claims["role"];
  if (Array.isArray(role)) return role.includes("admin");
  if (typeof role === "string") {
    return role.split(",").map((value) => value.trim()).includes("admin");
  }

  return false;
};

export const requireFirebaseUser = async (event: H3Event, options?: { requireAdmin?: boolean }) => {
  const header = getHeader(event, "authorization");
  const token = header?.replace(/^Bearer\s+/i, "");

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "Missing Authorization header." });
  }

  // Compliance: All privileged API routes must verify Firebase ID tokens on the backend.
  let decoded;
  try {
    decoded = await adminAuth.verifyIdToken(token);
  } catch {
    throw createError({ statusCode: 401, statusMessage: "Invalid or expired token." });
  }

  if (options?.requireAdmin && !hasAdminClaim(decoded)) {
    throw createError({ statusCode: 403, statusMessage: "Admin access required." });
  }

  return decoded;
};
