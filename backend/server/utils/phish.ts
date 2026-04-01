import crypto from "node:crypto";
import type { H3Event } from "h3";
import { getHeader } from "h3";

export type PhishTargetInput = {
  name?: string;
  email: string;
  department?: string;
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/i;

export const generateToken = () => crypto.randomBytes(16).toString("hex");

export const hashSensitive = (value: string) =>
  crypto.createHash("sha256").update(value).digest("hex");

export const getRequestMeta = (event: H3Event) => {
  const forwardedFor = getHeader(event, "x-forwarded-for");
  const ipAddress =
    typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0].trim()
      : event.node.req.socket.remoteAddress ?? null;
  const userAgent = getHeader(event, "user-agent");

  return {
    ipAddress: typeof ipAddress === "string" && ipAddress.length > 0 ? ipAddress : null,
    userAgent: typeof userAgent === "string" && userAgent.length > 0 ? userAgent : null,
  };
};

const parseTargetLine = (line: string): PhishTargetInput | null => {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const bracketMatch = trimmed.match(/^(.*?)<([^>]+)>$/);
  if (bracketMatch) {
    const name = bracketMatch[1]?.trim();
    const email = bracketMatch[2]?.trim();
    if (!email || !EMAIL_RE.test(email)) return null;
    return { name: name || undefined, email };
  }

  if (EMAIL_RE.test(trimmed)) {
    return { email: trimmed };
  }

  return null;
};

export const parseTargets = (input: unknown): PhishTargetInput[] => {
  if (Array.isArray(input)) {
    return input
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const name = typeof (item as any).name === "string" ? (item as any).name.trim() : undefined;
        const email = typeof (item as any).email === "string" ? (item as any).email.trim() : "";
        const department =
          typeof (item as any).department === "string" ? (item as any).department.trim() : undefined;
        if (!email || !EMAIL_RE.test(email)) return null;
        return { name, email, department };
      })
      .filter((value): value is PhishTargetInput => Boolean(value));
  }

  if (typeof input === "string") {
    return input
      .split(/\r?\n|,/)
      .map((line) => parseTargetLine(line))
      .filter((value): value is PhishTargetInput => Boolean(value));
  }

  return [];
};
