
import * as admin from 'firebase-admin';

let adminApp: admin.app.App;

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        adminApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT or initialize admin app", e);
    }
  } else {
    // This warning is helpful for local development if the env var is missing
    console.warn("FIREBASE_SERVICE_ACCOUNT environment variable not set. Firebase Admin SDK not initialized.");
  }
} else {
  adminApp = admin.app();
}

function getAdminAuth() {
    if (!admin.apps.length) {
        throw new Error('Firebase Admin SDK has not been initialized. FIREBASE_SERVICE_ACCOUNT environment variable might be missing.');
    }
    return admin.auth();
}

function getAdminFirestore() {
    if (!admin.apps.length) {
        throw new Error('Firebase Admin SDK has not been initialized. FIREBASE_SERVICE_ACCOUNT environment variable might be missing.');
    }
    return admin.firestore();
}

export { adminApp, getAdminAuth, getAdminFirestore };
