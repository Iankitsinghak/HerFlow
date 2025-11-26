
import * as admin from 'firebase-admin';

function getInitializedAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e);
    throw new Error('Failed to initialize Firebase Admin SDK. Please ensure server environment is configured correctly.');
  }

  return admin.app();
}

export function getAdminAuth(): admin.auth.Auth {
  const app = getInitializedAdminApp();
  return app.auth();
}

export function getAdminFirestore(): admin.firestore.Firestore {
  const app = getInitializedAdminApp();
  return app.firestore();
}
