
'use server';

import { redirect } from "next/navigation";
import { getAdminAuth, getAdminFirestore } from './firebase-admin';
import * as admin from 'firebase-admin';

export async function signup(userData: any) {
  const { email, password, ...profileData } = userData;

  if (!email) {
    return { error: "Email is required to sign up." };
  }

  try {
    const adminAuth = getAdminAuth();
    const adminFirestore = getAdminFirestore();
    let uid: string;
    
    try {
        const userRecord = await adminAuth.getUserByEmail(email);
        uid = userRecord.uid;
    } catch (error: any) {
        if (error.code === 'auth/user-not-found') {
            if (password) {
                const userRecord = await adminAuth.createUser({ 
                    email, 
                    password, 
                    displayName: profileData.name 
                });
                uid = userRecord.uid;
            } else {
                // For social sign-ins where a password isn't provided on this form
                const newUserRecord = await adminAuth.createUser({ email, displayName: profileData.name });
                uid = newUserRecord.uid;
            }
        } else {
            console.error("Admin Auth Error:", error);
            throw error;
        }
    }
    
    if (!uid) {
        throw new Error("Could not create or find user account.");
    }

    const userProfileRef = adminFirestore.doc(`users/${uid}/userProfiles/${uid}`);
    
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
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userProfileRef.set(finalProfileData, { merge: true });

    // Create the first cycle log if the date was provided
    if (profileData.lastPeriodDate && profileData.lastPeriodDate !== 'unknown') {
        const logsCollectionRef = adminFirestore.collection(`users/${uid}/cycleLogs`);
        await logsCollectionRef.add({
            userId: uid,
            date: profileData.lastPeriodDate,
            isPeriodDay: true,
            symptoms: [],
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }

  } catch (error: any) {
    console.error("Signup/Profile Update Error:", error);
    // Be careful not to leak sensitive implementation details in error messages.
    return { error: `An error occurred during signup. Details: ${error.message}` };
  }

  redirect('/dashboard');
}
