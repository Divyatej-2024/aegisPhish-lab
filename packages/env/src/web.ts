// packages/env/src/web.ts
// Browser-safe environment variables for Angular web app

declare global {
  interface Window {
    __env?: Record<string, string | undefined>;
  }
}

const isBrowser = typeof window !== "undefined";
const runtimeEnv = isBrowser ? window.__env ?? {} : {};

const readEnv = (key: string, fallback = "") => runtimeEnv[key] ?? fallback;

export const env = {
  NEXT_PUBLIC_API_URL: readEnv("NEXT_PUBLIC_API_URL"),
  NEXT_PUBLIC_APP_URL: readEnv("NEXT_PUBLIC_APP_URL"),
  VITE_SERVER_URL: readEnv("VITE_SERVER_URL"),
  VITE_FIREBASE_API_KEY: readEnv("VITE_FIREBASE_API_KEY"),
  VITE_FIREBASE_AUTH_DOMAIN: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
  VITE_FIREBASE_PROJECT_ID: readEnv("VITE_FIREBASE_PROJECT_ID"),
  VITE_FIREBASE_STORAGE_BUCKET: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
  VITE_FIREBASE_MESSAGING_SENDER_ID: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
  VITE_FIREBASE_APP_ID: readEnv("VITE_FIREBASE_APP_ID"),
  VITE_FIREBASE_MEASUREMENT_ID: readEnv("VITE_FIREBASE_MEASUREMENT_ID"),
  NODE_ENV: readEnv("NODE_ENV", "development"),
};

export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";

export const validateEnv = () => {
  if (!isBrowser) return true;

  const requiredVars = [
    "VITE_FIREBASE_API_KEY",
    "VITE_FIREBASE_AUTH_DOMAIN",
    "VITE_FIREBASE_PROJECT_ID",
    "VITE_FIREBASE_APP_ID",
  ];

  const missingVars = requiredVars.filter((key) => !env[key as keyof typeof env]);

  if (missingVars.length > 0 && isProduction) {
    console.error(`Missing required environment variables: ${missingVars.join(", ")}`);
    return false;
  }

  return true;
};

if (isBrowser && isDevelopment) {
  console.log("Environment:", {
    hasServerUrl: !!env.VITE_SERVER_URL,
    hasFirebaseApiKey: !!env.VITE_FIREBASE_API_KEY,
    hasFirebaseProjectId: !!env.VITE_FIREBASE_PROJECT_ID,
  });
}
