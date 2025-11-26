
"use client";

import {
    GoogleAuthProvider,
    signInWithPopup,
  } from "firebase/auth";
import { initializeFirebase } from "@/firebase";

const { auth } = initializeFirebase();


export async function googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { user: result.user };
    } catch (error: any) {
      return { error: error.message };
    }
}
