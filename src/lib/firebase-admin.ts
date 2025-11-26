
'use server';

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
    // Provide a more specific error if the default credentials are not found.
    if (e.message.includes('Google Application Credentials')) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set or invalid. This is required for server-side operations.');
    }
    throw new Error('Failed to initialize Firebase Admin SDK.');
  }

  return admin.app();
}

function getAdminAuth(): admin.auth.Auth {
  const app = getInitializedAdminApp();
  return app.auth();
}

function getAdminFirestore(): admin.firestore.Firestore {
  const app = getInitializedAdminApp();
  return app.firestore();
}

export { getAdminAuth, getAdminFirestore };
