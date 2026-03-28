import { signal } from "@angular/core";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "./firebase";
import { isAdminUser } from "./firebase-auth";

const userSignal = signal<User | null>(auth.currentUser);
const adminSignal = signal(false);
let initialized = false;

export const startAuthListener = () => {
  if (initialized) return;
  initialized = true;

  onAuthStateChanged(auth, (user) => {
    userSignal.set(user);
    if (!user) {
      adminSignal.set(false);
      return;
    }

    const uid = user.uid;
    isAdminUser()
      .then((isAdmin) => {
        if (auth.currentUser?.uid === uid) {
          adminSignal.set(isAdmin);
        }
      })
      .catch(() => {
        if (auth.currentUser?.uid === uid) {
          adminSignal.set(false);
        }
      });
  });
};

export const currentUser = userSignal;
export const isAdmin = adminSignal;
