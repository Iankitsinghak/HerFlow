
import * as admin from 'firebase-admin';

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

// Ensure that the app is only initialized once
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: serviceAccount ? admin.credential.cert(serviceAccount) : undefined,
    });
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        'Firebase Admin initialization failed. This may happen in environments where service account is not available. Using unauthenticated client-side fallbacks.'
      );
    }
  }
}

export const adminApp = admin.apps[0];
