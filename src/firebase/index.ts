'use client';

import { initializeFirebase } from '@/firebase/config';

// Re-export initializeFirebase for client components that might need it,
// though they should prefer the provider.
export { initializeFirebase };

// Export everything else from the original index file
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
