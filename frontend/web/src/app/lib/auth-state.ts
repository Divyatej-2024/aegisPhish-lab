import { signal } from "@angular/core";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "./firebase";

const userSignal = signal<User | null>(auth.currentUser);
let initialized = false;

export const startAuthListener = () => {
  if (initialized) return;
  initialized = true;

  onAuthStateChanged(auth, (user) => {
    userSignal.set(user);
  });
};

export const currentUser = userSignal;
