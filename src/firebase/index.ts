
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// This function is the single source of truth for initializing Firebase on the client.
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    throw new Error("initializeFirebase should only be called on the client.");
  }
  
  let firebaseApp: FirebaseApp;
  
  if (!getApps().length) {
    // This is the first time, initialize the app
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    // App is already initialized, get the instance
    firebaseApp = getApp();
  }
  
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);
  
  return { firebaseApp, auth, firestore };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './errors';
export * from './error-emitter';
