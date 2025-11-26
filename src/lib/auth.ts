"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { redirect } from "next/navigation";
import { z } from "zod";
import { FirebaseError } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function handleFirebaseError(error: unknown): string {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case "auth/invalid-email":
          return "Invalid email address.";
        case "auth/user-disabled":
          return "This user account has been disabled.";
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          return "Invalid email or password.";
        case "auth/email-already-in-use":
          return "An account with this email already exists.";
        case "auth/weak-password":
          return "The password is too weak.";
        default:
          return "An unexpected error occurred. Please try again.";
      }
    }
    return "An unexpected error occurred. Please try again.";
}

export async function login(values: z.infer<typeof loginSchema>) {
  try {
    const validatedValues = loginSchema.safeParse(values);
    if (!validatedValues.success) {
      return { error: "Invalid input." };
    }
    await signInWithEmailAndPassword(
      auth,
      validatedValues.data.email,
      validatedValues.data.password
    );
  } catch (error) {
    return { error: handleFirebaseError(error) };
  }
  redirect("/dashboard");
}

export async function signup(values: z.infer<typeof signupSchema>) {
    try {
        const validatedValues = signupSchema.safeParse(values);
        if (!validatedValues.success) {
            return { error: "Invalid input." };
        }
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            validatedValues.data.email,
            validatedValues.data.password
        );
        
        // Create user profile in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: "",
            createdAt: new Date(),
        });

    } catch (error) {
        return { error: handleFirebaseError(error) };
    }
    redirect("/dashboard/profile");
}

export async function logout() {
  await signOut(auth);
  redirect("/login");
}
