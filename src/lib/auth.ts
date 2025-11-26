
"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeFirebase } from "@/firebase/config";
import { doc, setDoc } from "firebase/firestore";
import { redirect } from "next/navigation";

const { auth, firestore } = initializeFirebase();

export async function signup(userData: any) {
  try {
    const { email, password, ...profileData } = userData;
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user) {
        const userProfileRef = doc(firestore, `users/${userCredential.user.uid}/userProfiles`, userCredential.user.uid);
        
        // Ensure displayName from onboarding is used
        const finalProfileData = {
          userId: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: profileData.name || userCredential.user.displayName || '',
          ...profileData,
        };

        // remove onboarding-specific fields that shouldn't be in the DB
        delete finalProfileData.name; 

        await setDoc(userProfileRef, finalProfileData, { merge: true });
    }
  } catch (error: any) {
    console.error("Signup Error:", error);
    return { error: error.message };
  }
  redirect('/dashboard');
}

export async function login({ email, password }: any) {
  try {
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  } catch (error: any) {
    return { error: error.message };
  }
  redirect('/dashboard');
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error: any) {
    return { error: error.message };
  }
   redirect('/login');
}
