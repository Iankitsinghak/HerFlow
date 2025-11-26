
import * as admin from 'firebase-admin';

// This function ensures that the Firebase Admin SDK is initialized only once.
function getInitializedAdminApp(): admin.app.App {
  // If the app is already initialized, return it.
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  // If not initialized, initialize it now.
  // In a secure server environment (like the one this app runs in),
  // the SDK automatically finds the necessary credentials from the environment variables.
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  } catch (e: any) {
    console.error('Firebase Admin SDK initialization error:', e);
    // Throw a clear error to make debugging easier in the future if credentials are ever missing.
    throw new Error('Failed to initialize Firebase Admin SDK. Please ensure server environment is configured correctly.');
  }

  // Return the newly initialized app.
  return admin.app();
}

// Export a function to get the authentication service.
export function getAdminAuth(): admin.auth.Auth {
  const app = getInitializedAdminApp();
  return app.auth();
}

// Export a function to get the Firestore service.
export function getAdminFirestore(): admin.firestore.Firestore {
  const app = getInitializedAdminApp();
  return app.firestore();
}
