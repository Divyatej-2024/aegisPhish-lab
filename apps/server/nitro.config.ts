import { defineNitroConfig } from "nitropack/config";

const corsOrigin = process.env.CORS_ORIGIN ?? "http://localhost:3001";

export default defineNitroConfig({
  // Server configuration
  compatibilityDate: "2025-01-01",
  preset: "bun",
  sourceMap: true,
  // Route rules
  routeRules: {
    "/api/**": {
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": corsOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Vary": "Origin",
      },
    },
  },
});
