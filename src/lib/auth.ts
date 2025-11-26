
"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeFirebase } from "@/firebase/config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { adminApp } from "./firebase-admin";

const { auth, firestore } = initializeFirebase();

export async function signup(userData: any) {
  const { email, password, ...profileData } = userData;

  try {
    let user;
    const adminAuth = getAdminAuth(adminApp);
    
    // Check if user exists via server-side check. This is more reliable.
    let userExists = false;
    try {
        const userRecord = await adminAuth.getUserByEmail(email);
        user = userRecord;
        userExists = true;
    } catch (error: any) {
        if (error.code !== 'auth/user-not-found') {
            throw error; // Re-throw unexpected errors
        }
        // user-not-found is the expected case for a new signup
    }

    if (!userExists) {
        // User does not exist, create them
        if (!password) {
            throw new Error("Password is required for new user signup.");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
    }
    
    if (!user) {
        throw new Error("Could not create or find user.");
    }

    // Now, save the profile data to Firestore.
    // This works for both new users and existing users (e.g., Google sign-in)
    const userProfileRef = doc(firestore, `users/${user.uid}/userProfiles`, user.uid);
    
    const finalProfileData = {
      userId: user.uid,
      email: user.email,
      displayName: profileData.name || user.displayName || '',
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

  } catch (error: any) {
    console.error("Signup/Profile Update Error:", error);
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
