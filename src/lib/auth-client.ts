
"use client";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    signOut,
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

export async function login(values: any) {
  try {
    await signInWithEmailAndPassword(
      auth,
      values.email,
      values.password
    );
    // Let the onAuthStateChanged listener handle the redirect
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function logout() {
  try {
    await signOut(auth);
    // Redirect happens in a useEffect hook watching the user state
    window.location.href = '/login';
  } catch (error: any) {
    console.error("Logout failed:", error);
    return { error: error.message };
  }
}
