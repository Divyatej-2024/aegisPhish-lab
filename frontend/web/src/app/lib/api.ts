import { env } from "@aegisPhish-lab/env/web";

import { getIdToken } from "./firebase-auth";

const API_BASE = env.VITE_SERVER_URL || "";
const DEFAULT_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  readonly status: number;
  readonly details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export const apiFetch = async (input: string, init: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutMs = typeof init.signal === "undefined" ? DEFAULT_TIMEOUT_MS : 0;
  const timeout = timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : null;

  const token = await getIdToken();
  const headers = new Headers(init.headers ?? {});
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    // Compliance: Always send Firebase ID tokens to backend for verification.
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    return await fetch(`${API_BASE}${input}`, {
      ...init,
      headers,
      cache: "no-store",
      credentials: "same-origin",
      signal: init.signal ?? controller.signal,
    });
  } finally {
    if (timeout) clearTimeout(timeout);
  }
};

const parseJsonSafe = async (response: Response) => {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return null;
  }
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const apiFetchJson = async <T>(input: string, init: RequestInit = {}): Promise<T> => {
  const response = await apiFetch(input, init);
  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && "statusMessage" in payload && typeof (payload as any).statusMessage === "string"
        ? (payload as any).statusMessage
        : null)
      ?? `Request failed (${response.status})`;
    throw new ApiError(message, response.status, payload);
  }

  if (payload === null) {
    throw new ApiError("Expected JSON response from API.", response.status);
  }

  return payload as T;
};
