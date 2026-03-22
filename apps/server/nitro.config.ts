import { defineNitroConfig } from "nitropack/config";

export default defineNitroConfig({
  // Server configuration
  compatibilityDate: "2025-01-01",
  preset: "bun",
  sourceMap: true,
  // Route rules
  routeRules: {
    "/**": {
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    },
  },
});
