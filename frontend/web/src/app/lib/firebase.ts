import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

import { env } from "@aegisPhish-lab/env/web";

// Debug: Log what env contains
console.log('🔥 Firebase init - env object:', {
  hasApiKey: !!env.VITE_FIREBASE_API_KEY,
  apiKeyValue: env.VITE_FIREBASE_API_KEY,
  hasProjectId: !!env.VITE_FIREBASE_PROJECT_ID,
  projectIdValue: env.VITE_FIREBASE_PROJECT_ID,
});

// Also check window.__env directly
console.log('🔥 window.__env:', (window as any).__env);

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

console.log('🔥 Firebase config:', firebaseConfig);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Persist sessions locally so refreshes keep users signed in.
setPersistence(auth, browserLocalPersistence).catch(() => {
  // Persistence can fail in private mode; auth still works without it.
});

export { app, auth, googleProvider };