
"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export async function signup({ email, password }: any) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // You can add user profile creation here if needed
    return { user: userCredential.user };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function login({ email, password }: any) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function googleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { user: result.user };
    } catch (error: any) {
      return { error: error.message };
    }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error: any) {
    return { error: error.message };
  }
}
