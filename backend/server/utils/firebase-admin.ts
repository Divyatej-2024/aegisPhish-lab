import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

import { env } from "@aegisPhish-lab/env/server";

const privateKey = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey,
        }),
        projectId: env.FIREBASE_PROJECT_ID,
      });

export const adminAuth = getAuth(app);
