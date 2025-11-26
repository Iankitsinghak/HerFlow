
"use client";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    type Auth,
  } from "firebase/auth";
import { initializeFirebase } from "@/firebase";

// Get the auth instance once and reuse it.
let auth: Auth;
try {
    auth = initializeFirebase().auth;
} catch (e) {
    console.error("Failed to initialize Firebase Auth on the client", e);
}


export async function googleSignIn() {
    if (!auth) return { error: "Auth service not available." };
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return { user: result.user };
    } catch (error: any) {
      return { error: error.message };
    }
}

export async function login(values: any) {
    if (!auth) return { error: "Auth service not available." };
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

export async function clientSignup(values: any) {
    if (!auth) return { error: "Auth service not available." };
    try {
        await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
        );
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}


export async function logout() {
  if (!auth) return { error: "Auth service not available." };
  try {
    await signOut(auth);
    // Redirect happens in a useEffect hook watching the user state
    window.location.href = '/login';
  } catch (error: any)
  {
    console.error("Logout failed:", error);
    return { error: error.message };
  }
}
