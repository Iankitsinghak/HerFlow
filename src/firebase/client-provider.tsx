
'use client';

import React, { type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { getApp } from 'firebase/app';
import { auth, firestore } from '@/lib/auth-client'; // Import initialized services

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  // The Firebase app, auth, and firestore instances are now initialized
  // directly in '@lib/auth-client.ts'. We can get the app instance
  // here and pass all three to the underlying provider.

  // This will throw if the app is not initialized, which is what we want.
  const firebaseApp = getApp();

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
