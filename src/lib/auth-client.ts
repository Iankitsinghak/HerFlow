
"use client";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
  } from "firebase/auth";
import { clientAuth } from "@/firebase";

export async function googleSignIn() {
    if (!clientAuth) return { error: "Auth service not available." };
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(clientAuth, provider);
      return { user: result.user };
    } catch (error: any) {
      return { error: error.message };
    }
}

export async function login(values: any) {
    if (!clientAuth) return { error: "Auth service not available." };
  try {
    await signInWithEmailAndPassword(
      clientAuth,
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
    if (!clientAuth) return { error: "Auth service not available." };
    try {
        await createUserWithEmailAndPassword(
            clientAuth,
            values.email,
            values.password
        );
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}


export async function logout() {
  if (!clientAuth) return { error: "Auth service not available." };
  try {
    await signOut(clientAuth);
    // Redirect happens in a useEffect hook watching the user state
    window.location.href = '/login';
  } catch (error: any)
  {
    console.error("Logout failed:", error);
    return { error: error.message };
  }
}
