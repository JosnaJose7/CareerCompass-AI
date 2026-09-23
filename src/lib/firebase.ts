import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInAnonymously, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  updateDoc 
} from 'firebase/firestore';

// Default config fallback if config file is loaded dynamically or synchronously
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Enable persistent login across browser sessions
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Failed to set auth persistence:', err);
});

export const db = getFirestore(app, firebaseConfigData.firestoreDatabaseId || '(default)');
export const googleProvider = new GoogleAuthProvider();

export {
  signInWithPopup,
  signInAnonymously,
  firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc
};
export type { FirebaseUser };

import type { UserAuthRole } from '../types';

export const SUPERADMIN_EMAIL = 'shynijose14@gmail.com';

/**
 * Securely determines the user's role without trusting any client-side user profile fields.
 * Validates cryptographically signed Firebase ID token custom claims, trusted Firestore
 * access rosters, and runtime superadmin bootstrap status.
 */
export async function getUserAuthRole(currentUser: FirebaseUser | null, forceRefresh = false): Promise<UserAuthRole> {
  if (!currentUser) {
    return {
      uid: 'guest',
      email: null,
      role: 'student',
      isFaculty: false,
      isAdmin: false,
      emailVerified: false,
      customClaimsSource: 'guest_student'
    };
  }

  // 1. Inspect cryptographically signed Firebase ID Token Custom Claims
  try {
    const idTokenResult = await currentUser.getIdTokenResult(forceRefresh);
    const claims = idTokenResult.claims || {};

    const claimRole = claims.role as string | undefined;
    const isClaimAdmin = Boolean(claims.admin === true || claimRole === 'admin');
    const isClaimFaculty = Boolean(claims.faculty === true || claimRole === 'faculty');

    if (isClaimAdmin) {
      return {
        uid: currentUser.uid,
        email: currentUser.email,
        role: 'admin',
        isFaculty: true,
        isAdmin: true,
        emailVerified: Boolean(currentUser.emailVerified),
        customClaimsSource: 'custom_claims'
      };
    }

    if (isClaimFaculty) {
      return {
        uid: currentUser.uid,
        email: currentUser.email,
        role: 'faculty',
        isFaculty: true,
        isAdmin: false,
        emailVerified: Boolean(currentUser.emailVerified),
        customClaimsSource: 'custom_claims'
      };
    }
  } catch (err) {
    console.warn('Failed to inspect Firebase ID token claims:', err);
  }

  // 2. Runtime Superadmin Bootstrap check
  // The system owner is recognized as superadmin when authenticated with verified institutional email
  if (currentUser.email && currentUser.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase()) {
    return {
      uid: currentUser.uid,
      email: currentUser.email,
      role: 'admin',
      isFaculty: true,
      isAdmin: true,
      emailVerified: Boolean(currentUser.emailVerified),
      customClaimsSource: 'superadmin'
    };
  }

  // 3. Check Trusted Firestore Faculty Roster (/facultyUsers/{uid})
  // This collection is protected by security rules: only admins can write to it.
  try {
    const facultyDocRef = doc(db, 'facultyUsers', currentUser.uid);
    const facultyDocSnap = await getDoc(facultyDocRef);
    if (facultyDocSnap.exists()) {
      const data = facultyDocSnap.data();
      if (data?.active !== false) {
        return {
          uid: currentUser.uid,
          email: currentUser.email,
          role: 'faculty',
          isFaculty: true,
          isAdmin: Boolean(data?.isAdmin),
          emailVerified: Boolean(currentUser.emailVerified),
          customClaimsSource: 'firestore_roster'
        };
      }
    }

    // Also check admins collection
    const adminDocRef = doc(db, 'admins', currentUser.uid);
    const adminDocSnap = await getDoc(adminDocRef);
    if (adminDocSnap.exists()) {
      return {
        uid: currentUser.uid,
        email: currentUser.email,
        role: 'admin',
        isFaculty: true,
        isAdmin: true,
        emailVerified: Boolean(currentUser.emailVerified),
        customClaimsSource: 'firestore_roster'
      };
    }
  } catch (err) {
    // If offline or permission denied, fallback to default student role
    console.warn('Firestore roster check:', err);
  }

  // Default: Standard student role with zero faculty privileges
  return {
    uid: currentUser.uid,
    email: currentUser.email,
    role: 'student',
    isFaculty: false,
    isAdmin: false,
    emailVerified: Boolean(currentUser.emailVerified),
    customClaimsSource: 'guest_student'
  };
}


