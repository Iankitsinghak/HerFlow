
import * as admin from 'firebase-admin';

let adminApp: admin.app.App;

// Initialize the app only if it hasn't been initialized yet
if (!admin.apps.length) {
  // Check if the service account environment variable exists before trying to initialize
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        adminApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT or initialize app", e);
    }
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT environment variable not set. Admin SDK not initialized.");
  }
} else {
  adminApp = admin.app(); // Get the default app if it already exists
}

// A function to get the admin auth instance, which throws if not initialized
function getAdminAuth() {
    if (!admin.apps.length) {
        throw new Error('Firebase Admin SDK has not been initialized. FIREBASE_SERVICE_ACCOUNT environment variable might be missing.');
    }
    return admin.auth();
}

export { adminApp, getAdminAuth };
