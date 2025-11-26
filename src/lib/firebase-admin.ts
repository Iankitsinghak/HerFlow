
'use server';

import * as admin from 'firebase-admin';

// A function to get the initialized app, or initialize it if it doesn't exist.
function getInitializedAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  // If the app is not initialized, initialize it here.
  // This will only run once per server instance.
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (e: any) {
    if (e.code === 'ENOENT' || (e.message && e.message.includes('FIREBASE_SERVICE_ACCOUNT'))) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable not set. This is required for server-side operations.');
    }
    console.error('Firebase Admin SDK initialization error:', e);
    throw new Error('Failed to initialize Firebase Admin SDK.');
  }

  return admin.app();
}

function getAdminAuth(): admin.auth.Auth {
  // Ensure the app is initialized before getting the auth service.
  const app = getInitializedAdminApp();
  return app.auth();
}

function getAdminFirestore(): admin.firestore.Firestore {
  // Ensure the app is initialized before getting the firestore service.
  const app = getInitializedAdminApp();
  return app.firestore();
}

export { getAdminAuth, getAdminFirestore };
