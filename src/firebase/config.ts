import config from '../firebase-applet-config.json';

/**
 * Firebase configuration object derived from the applet config file.
 * Supports environment variable overrides for flexible deployment (e.g., Vercel).
 */
export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || config.projectId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || config.appId,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || config.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || config.authDomain,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || config.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || config.messagingSenderId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || config.measurementId,
  // Included for Firestore context
  firestoreDatabaseId: config.firestoreDatabaseId || '(default)',
};
