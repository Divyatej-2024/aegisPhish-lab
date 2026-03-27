import { createUserWithEmailAndPassword, getIdTokenResult, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, User } from "firebase/auth";

import { auth, googleProvider } from "./firebase";

const hasAdminClaim = (claims: Record<string, unknown>) => {
  // Custom claims should be set via Firebase Admin SDK (e.g., { admin: true } or role: "admin").
  if (claims["admin"] === true) return true;

  const role = claims["role"];
  if (Array.isArray(role)) return role.includes("admin");
  if (typeof role === "string") {
    return role.split(",").map((value) => value.trim()).includes("admin");
  }

  return false;
};

export const waitForAuthReady = () =>
  new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });

export const getCurrentUser = async () => auth.currentUser ?? (await waitForAuthReady());

export const getIdToken = async () => {
  const user = await getCurrentUser();
  return user ? user.getIdToken() : null;
};

export const getIdTokenClaims = async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  const tokenResult = await getIdTokenResult(user, true);
  return tokenResult.claims;
};

export const isAdminUser = async () => {
  const claims = await getIdTokenClaims();
  return claims ? hasAdminClaim(claims) : false;
};

export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const signOutUser = () => signOut(auth);
