
"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { redirect } from "next/navigation";
import { z } from "zod";
import { FirebaseError } from "firebase/app";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
        case "auth/popup-closed-by-user":
            return "The sign-in popup was closed before completion. Please try again.";
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
        
        const user = userCredential.user;
        // Create user profile in Firestore
        const userProfileRef = doc(db, "users", user.uid, "userProfiles", user.uid);
        await setDoc(userProfileRef, {
            userId: user.uid,
            email: user.email,
            displayName: user.displayName || "",
            profilePictureUrl: user.photoURL || "",
            bio: "",
        });

    } catch (error) {
        return { error: handleFirebaseError(error) };
    }
    redirect("/dashboard/profile");
}

export async function googleSignIn() {
    try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user profile already exists
        const userProfileRef = doc(db, "users", user.uid, "userProfiles", user.uid);
        const docSnap = await getDoc(userProfileRef);

        if (!docSnap.exists()) {
            // Create user profile in Firestore if it doesn't exist
            await setDoc(userProfileRef, {
                userId: user.uid,
                email: user.email,
                displayName: user.displayName || "",
                profilePictureUrl: user.photoURL || "",
                bio: "",
            });
        }
    } catch (error) {
        return { error: handleFirebaseError(error) };
    }
    redirect("/dashboard");
}


export async function logout() {
  await signOut(auth);
  redirect("/login");
}
