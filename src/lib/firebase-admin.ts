
import * as admin from 'firebase-admin';

// This guard prevents re-initializing the app in serverless environments
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
  } catch (e) {
    console.error("Firebase Admin SDK initialization error:", e);
  }
}

const adminApp = admin.app();

function getAdminAuth() {
    if (!admin.apps.length) {
        throw new Error('Firebase Admin SDK has not been initialized.');
    }
    return admin.auth();
}

function getAdminFirestore() {
    if (!admin.apps.length) {
        throw new Error('Firebase Admin SDK has not been initialized.');
    }
    return admin.firestore();
}

export { adminApp, getAdminAuth, getAdminFirestore };
