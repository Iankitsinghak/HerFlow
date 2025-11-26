
"use server";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeFirebase } from "@/firebase";
import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { redirect } from "next/navigation";
import { getAdminAuth } from './firebase-admin';

const { auth, firestore } = initializeFirebase();

export async function signup(userData: any) {
  const { email, password, ...profileData } = userData;

  if (!email) {
    return { error: "Email is required to sign up." };
  }

  try {
    let uid: string;
    const adminAuth = getAdminAuth();
    
    try {
        const userRecord = await adminAuth.getUserByEmail(email);
        uid = userRecord.uid;
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            // User does not exist, create a new one
            if (password) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                uid = userCredential.user.uid;
            } else {
                // This handles cases like Google Sign-In where a user might not have a password but needs an auth record
                const newUserRecord = await adminAuth.createUser({ email, displayName: profileData.name });
                uid = newUserRecord.uid;
            }
        } else {
            console.error("Admin Auth Error:", error);
            throw error; // Re-throw other admin errors
        }
    }
    
    if (!uid) {
        throw new Error("Could not create or find user account.");
    }

    // Now that we have a UID, save the profile data.
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

    // Use merge: true to avoid overwriting existing data if a user re-onboards
    await setDoc(userProfileRef, finalProfileData, { merge: true });

    // After saving profile, create the first cycle log if last period date is known
    if (profileData.lastPeriodDate && profileData.lastPeriodDate !== 'unknown') {
        const logsCollectionRef = collection(firestore, `users/${uid}/cycleLogs`);
        // Note: For simplicity, we're not checking if a log for this exact date already exists.
        // In a production app, you might want to prevent duplicate logs for the same day.
        await addDoc(logsCollectionRef, {
            userId: uid,
            date: profileData.lastPeriodDate,
            isPeriodDay: true,
            symptoms: [],
            createdAt: serverTimestamp()
        });
    }

  } catch (error: any) {
    console.error("Signup/Profile Update Error:", error);
    // Provide a more user-friendly error message
    return { error: `An error occurred during signup: ${error.message}` };
  }

  // On successful signup and profile save, redirect to the dashboard.
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
