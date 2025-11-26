
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

  if (!email) {
    return { error: "Email is required to sign up." };
  }

  try {
    let user;
    const adminAuth = getAdminAuth(adminApp);
    
    // Check if user exists via server-side check.
    let userExists = false;
    let uid: string | undefined;

    try {
        const userRecord = await adminAuth.getUserByEmail(email);
        uid = userRecord.uid;
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
            // This case handles social auth users who are new but don't have a password set yet
            // We create them in Firebase Auth from the server.
            const newUserRecord = await adminAuth.createUser({ email, displayName: profileData.name });
            uid = newUserRecord.uid;
        } else {
             // This handles email/password signup
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            uid = userCredential.user.uid;
        }
    }
    
    if (!uid) {
        throw new Error("Could not create or find user account.");
    }

    // Now, save the profile data to Firestore.
    // This works for both new users and existing users (e.g., Google sign-in)
    const userProfileRef = doc(firestore, `users/${uid}/userProfiles`, uid);
    
    const finalProfileData = {
      userId: uid,
      email: email,
      displayName: profileData.name,
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
