
'use client';

import React, { useEffect, useState, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

interface FirebaseServices {
    firebaseApp: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [firebaseServices, setFirebaseServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // This effect runs only once on the client after the component mounts.
    if (typeof window !== 'undefined' && !firebaseServices) {
      const services = initializeFirebase();
      if (!services.firebaseApp || !services.auth || !services.firestore) {
        throw new Error("Firebase could not be initialized on the client.");
      }
      setFirebaseServices(services);
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  if (!firebaseServices) {
    // You can render a loading spinner or null here while waiting for Firebase to initialize.
    return null;
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
