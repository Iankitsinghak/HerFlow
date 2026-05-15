
import config from '../firebase-applet-config.json';

// We map the JSON values back to their environment variable equivalents 
// or the static values provided in the JSON to ensure Vercel picks them up.
export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || config.projectId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || config.appId,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || config.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || config.authDomain,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || config.storageBucket,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || config.measurementId,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || config.messagingSenderId,
};
