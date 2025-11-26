
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

    // Check if email and password are provided. A temporary one is created on the summary page.
    if (!email || !password) {
      throw new Error("Email and password are required for signup.");
    }

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user) {
        const userProfileRef = doc(firestore, `users/${userCredential.user.uid}/userProfiles`, userCredential.user.uid);
        
        const finalProfileData = {
          userId: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: profileData.name || '',
          ageRange: profileData.ageRange || null,
          country: profileData.country || null,
          periodStatus: profileData.periodStatus || null,
          cycleLength: profileData.cycleLength || null,
          lastPeriodDate: profileData.lastPeriodDate || null,
          focusAreas: profileData.focusAreas || [],
          doctorComfort: profileData.doctorComfort || null,
          sharingPreference: profileData.sharingPreference || null,
          showReminders: profileData.showReminders === undefined ? true : profileData.showReminders,
          createdAt: new Date().toISOString(),
        };

        await setDoc(userProfileRef, finalProfileData, { merge: true });
    }
  } catch (error: any) {
    console.error("Signup Error:", error);
    // In a real app, you'd want to return this error to the UI
    // For now, we'll log it and the redirect won't happen.
    return { error: error.message };
  }
  // Redirect to the dashboard after successful signup and profile creation.
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
