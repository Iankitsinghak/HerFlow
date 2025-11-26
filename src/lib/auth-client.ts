
"use client";

import {
    GoogleAuthProvider,
    signInWithPopup,
  } from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { user: result.user };
    } catch (error: any) {
      return { error: error.message };
    }
}
