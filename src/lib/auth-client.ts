
"use client";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    type Auth,
    type User,
  } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, setDoc, addDoc, collection, serverTimestamp, getDoc } from "firebase/firestore";
import { firebaseConfig } from "@/firebase/config";
import { getAuth } from "firebase/auth";

// --- START: Consolidated Firebase Initialization ---
// This pattern ensures that Firebase is initialized only once on the client.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const firestore = getFirestore(app);
// --- END: Consolidated Firebase Initialization ---

export { auth, firestore }; // Export initialized services

export async function googleSignIn() {
    if (!auth) return { error: "Auth service not available." };
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userProfileRef = doc(firestore, `users/${result.user.uid}/userProfiles`, result.user.uid);
      const userProfileSnap = await getDoc(userProfileRef);
      
      if (!userProfileSnap.exists()) {
          return { user: result.user, isNewUser: true };
      }

      return { user: result.user, isNewUser: false };

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
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function clientSignup(values: any) {
    if (!auth) return { error: "Auth service not available." };
    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            values.email,
            values.password
        );
        return { success: true, user: userCredential.user };
    } catch (error: any) {
        return { error: error.message };
    }
}

export async function completeOnboarding(currentUser: User, onboardingData: any) {
    if (!firestore || !currentUser) {
        return { error: "Firestore or user not available." };
    }

    try {
        const uid = currentUser.uid;
        const userProfileRef = doc(firestore, `users/${uid}/userProfiles`, uid);

        // Robust fallback for displayName
        const displayName = onboardingData.name || currentUser.displayName || currentUser.email || 'User';

        const finalProfileData = {
            userId: uid,
            email: currentUser.email,
            displayName: displayName,
            ageRange: onboardingData.ageRange || null,
            country: onboardingData.country || null,
            periodStatus: onboardingData.periodStatus || null,
            cycleLength: onboardingData.cycleLength || null,
            periodDuration: onboardingData.periodDuration || null,
            lastPeriodDate: onboardingData.lastPeriodDate || null,
            focusAreas: onboardingData.focusAreas || [],
            doctorComfort: onboardingData.doctorComfort || null,
            sharingPreference: onboardingData.sharingPreference || null,
            showReminders: onboardingData.showReminders === undefined ? true : onboardingData.showReminders,
            createdAt: serverTimestamp(),
        };

        await setDoc(userProfileRef, finalProfileData, { merge: true });

        if (onboardingData.lastPeriodDate && onboardingData.lastPeriodDate !== 'unknown') {
            const logsCollectionRef = collection(firestore, `users/${uid}/cycleLogs`);
            await addDoc(logsCollectionRef, {
                userId: uid,
                date: onboardingData.lastPeriodDate,
                isPeriodDay: true,
                symptoms: [],
                createdAt: serverTimestamp()
            });
        }
        
        return { success: true };

    } catch (error: any) {
        console.error("Onboarding Completion Error:", error);
        return { error: `An error occurred during profile setup. Details: ${error.message}` };
    }
}

export async function logout() {
  if (!auth) return { error: "Auth service not available." };
  try {
    await signOut(auth);
    window.location.href = '/login';
  } catch (error: any)
  {
    console.error("Logout failed:", error);
    return { error: error.message };
  }
}
