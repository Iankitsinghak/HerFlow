
"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeFirebase } from "@/firebase/config"; // Changed import
import { doc, setDoc } from "firebase/firestore";

const { auth, firestore } = initializeFirebase();

export async function signup({ email, password }: any) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user) {
        const userProfileRef = doc(firestore, `users/${userCredential.user.uid}/userProfiles`, userCredential.user.uid);
        await setDoc(userProfileRef, {
            userId: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            profilePictureUrl: userCredential.user.photoURL
        });
    }

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

export async function logout() {
  try {
    await signOut(auth);
  } catch (error: any) {
    return { error: error.message };
  }
}
