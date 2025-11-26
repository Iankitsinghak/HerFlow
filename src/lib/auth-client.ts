
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
import { initializeFirebase } from "@/firebase";
import { doc, setDoc, addDoc, collection, serverTimestamp, getDoc } from "firebase/firestore";

// Get the auth and firestore instances once and reuse them.
let auth: Auth;
let firestore: any;
try {
    const services = initializeFirebase();
    auth = services.auth;
    firestore = services.firestore;
} catch (e) {
    console.error("Failed to initialize Firebase on the client", e);
}


export async function googleSignIn() {
    if (!auth) return { error: "Auth service not available." };
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userProfileRef = doc(firestore, `users/${result.user.uid}/userProfiles`, result.user.uid);
      const userProfileSnap = await getDoc(userProfileRef);
      
      // If the profile doesn't exist, it's their first time through social sign-in.
      // Redirect to onboarding. Otherwise, to dashboard.
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
    // Let the onAuthStateChanged listener handle the redirect
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

        const finalProfileData = {
            userId: uid,
            email: currentUser.email,
            displayName: onboardingData.name,
            ageRange: onboardingData.ageRange || null,
            country: onboardingData.country || null,
            periodStatus: onboardingData.periodStatus || null,
            cycleLength: onboardingData.cycleLength || null,
            lastPeriodDate: onboardingData.lastPeriodDate || null,
            focusAreas: onboardingData.focusAreas || [],
            doctorComfort: onboardingData.doctorComfort || null,
            sharingPreference: onboardingData.sharingPreference || null,
            showReminders: onboardingData.showReminders === undefined ? true : onboardingData.showReminders,
            createdAt: serverTimestamp(),
        };

        // Use setDoc with merge:true to create or update the profile.
        await setDoc(userProfileRef, finalProfileData, { merge: true });

        // Create the first cycle log if the date was provided.
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
    // Redirect happens in a useEffect hook watching the user state
    window.location.href = '/login';
  } catch (error: any)
  {
    console.error("Logout failed:", error);
    return { error: error.message };
  }
}
