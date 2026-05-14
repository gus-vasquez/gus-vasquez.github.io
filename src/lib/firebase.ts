import { type FirebaseApp, getApps, initializeApp } from "firebase/app"

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.GATSBY_FIREBASE_API_KEY &&
      process.env.GATSBY_FIREBASE_AUTH_DOMAIN &&
      process.env.GATSBY_FIREBASE_PROJECT_ID &&
      process.env.GATSBY_FIREBASE_APP_ID,
  )
}

/** Single Firestore segment derived from the Gatsby post `slug` (may contain `/`). */
export function postSlugToFirestoreDocId(slug: string): string {
  return encodeURIComponent(slug)
}

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === `undefined` || !isFirebaseConfigured()) {
    return null
  }
  if (getApps().length > 0) {
    return getApps()[0]!
  }
  return initializeApp({
    apiKey: process.env.GATSBY_FIREBASE_API_KEY,
    authDomain: process.env.GATSBY_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.GATSBY_FIREBASE_PROJECT_ID,
    storageBucket: process.env.GATSBY_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.GATSBY_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.GATSBY_FIREBASE_APP_ID,
  })
}
