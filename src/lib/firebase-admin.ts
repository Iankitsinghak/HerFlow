
import * as admin from 'firebase-admin';

// Check if the service account environment variable exists
if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable not set.');
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

let adminApp: admin.app.App;

// Initialize the app only if it hasn't been initialized yet
if (!admin.apps.length) {
  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  adminApp = admin.app(); // Get the default app if it already exists
}

export { adminApp };
