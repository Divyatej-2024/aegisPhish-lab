import { env } from "@aegisPhish-lab/env/web";

import { getIdToken } from "./firebase-auth";

const API_BASE = env.VITE_SERVER_URL || "";

export const apiFetch = async (input: string, init: RequestInit = {}) => {
  const token = await getIdToken();
  const headers = new Headers(init.headers ?? {});

  if (token) {
    // Compliance: Always send Firebase ID tokens to backend for verification.
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_BASE}${input}`, {
    ...init,
    headers,
  });
};
