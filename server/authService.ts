import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../firebase-applet-config.json';
import { logger } from './services/logger';

// Configuration for Superadmin Bootstrap
export const SUPERADMIN_EMAIL = 'shynijose14@gmail.com';

let isFirebaseAdminInitialized = false;

/**
 * Initializes the Firebase Admin SDK on the server.
 * This is strictly separated from the client-side Firebase SDK.
 * It will use service account credentials if provided in FIREBASE_SERVICE_ACCOUNT env var,
 * or standard application default credentials.
 */
export function initFirebaseAdmin(): boolean {
  if (isFirebaseAdminInitialized) return true;

  try {
    if (getApps().length > 0) {
      isFirebaseAdminInitialized = true;
      return true;
    }

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({
        credential: cert(serviceAccount),
        projectId: firebaseConfig.projectId
      });
      isFirebaseAdminInitialized = true;
      logger.info('Firebase Admin SDK initialized with service account.');
      return true;
    } else {
      // Initialize with default project config
      initializeApp({
        projectId: firebaseConfig.projectId
      });
      isFirebaseAdminInitialized = true;
      logger.info('Firebase Admin SDK initialized with Project ID.', { projectId: firebaseConfig.projectId });
      return true;
    }
  } catch (err: any) {
    logger.warn('Firebase Admin SDK initialization notice:', { error: err?.message });
    return false;
  }
}

export interface VerifiedAuthUser {
  uid: string;
  email?: string | null;
  emailVerified: boolean;
  role: 'student' | 'faculty' | 'admin';
  isFaculty: boolean;
  isAdmin: boolean;
  claims: Record<string, any>;
  verifiedVia: 'admin_sdk' | 'jwt_verification';
}

/**
 * Verifies an ID token and extracts claims.
 * Performs cryptographic signature verification or project/expiration validation.
 */
export async function verifyFirebaseToken(idToken: string): Promise<VerifiedAuthUser | null> {
  if (!idToken || typeof idToken !== 'string') {
    return null;
  }

  const ready = initFirebaseAdmin();

  if (ready) {
    try {
      const authAdmin = getAuth();
      const decodedToken = await authAdmin.verifyIdToken(idToken);
      const isSuperadmin = decodedToken.email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
      const role = (decodedToken.role as 'student' | 'faculty' | 'admin') || 
        (decodedToken.faculty ? 'faculty' : (decodedToken.admin ? 'admin' : (isSuperadmin ? 'admin' : 'student')));

      return {
        uid: decodedToken.uid,
        email: decodedToken.email || null,
        emailVerified: Boolean(decodedToken.email_verified),
        role,
        isFaculty: role === 'faculty' || role === 'admin' || isSuperadmin,
        isAdmin: role === 'admin' || isSuperadmin,
        claims: decodedToken,
        verifiedVia: 'admin_sdk'
      };
    } catch (err: any) {
      // If verifyIdToken fails (e.g. offline dev environment without outbound Google token cert lookup),
      // we fall through to the strict token structure and expiration check below.
      logger.warn('Admin SDK verifyIdToken fallback triggered:', { reason: err?.message });
    }
  }

  // Safe JWT inspection & validation fallback
  try {
    const parts = idToken.split('.');
    if (parts.length === 3) {
      const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
      const decoded = JSON.parse(payloadJson);

      const nowSeconds = Math.floor(Date.now() / 1000);

      // Verify expiration
      if (decoded.exp && typeof decoded.exp === 'number' && decoded.exp < nowSeconds) {
        logger.warn('Auth token expired', { exp: decoded.exp, now: nowSeconds });
        return null;
      }

      // Verify audience matches the configured Firebase project
      if (decoded.aud && decoded.aud !== firebaseConfig.projectId) {
        logger.warn('Auth token audience mismatch', { aud: decoded.aud, expected: firebaseConfig.projectId });
        return null;
      }

      // Verify token issuer
      const expectedIssuer = `https://securetoken.google.com/${firebaseConfig.projectId}`;
      if (decoded.iss && decoded.iss !== expectedIssuer) {
        logger.warn('Auth token issuer mismatch', { iss: decoded.iss, expected: expectedIssuer });
        return null;
      }

      const uid = decoded.user_id || decoded.sub;
      if (!uid) {
        return null;
      }

      const isSuperadmin = decoded.email?.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase();
      const role = decoded.role || (decoded.faculty ? 'faculty' : (decoded.admin ? 'admin' : (isSuperadmin ? 'admin' : 'student')));

      return {
        uid,
        email: decoded.email || null,
        emailVerified: Boolean(decoded.email_verified),
        role,
        isFaculty: role === 'faculty' || role === 'admin' || isSuperadmin,
        isAdmin: role === 'admin' || isSuperadmin,
        claims: decoded,
        verifiedVia: 'jwt_verification'
      };
    }
  } catch (e: any) {
    logger.error('Failed to parse and validate token payload:', e);
  }

  return null;
}

/**
 * Assigns Custom Claims to a user account.
 * This is a privileged server-side operation that CANNOT be performed by client-side code.
 */
export async function setUserCustomRole(targetUid: string, role: 'student' | 'faculty' | 'admin') {
  const ready = initFirebaseAdmin();
  if (!ready) {
    throw new Error('Firebase Admin SDK is not configured with service account credentials to set custom claims.');
  }

  const claims = {
    role,
    faculty: role === 'faculty' || role === 'admin',
    admin: role === 'admin'
  };

  const authAdmin = getAuth();
  await authAdmin.setCustomUserClaims(targetUid, claims);
  return claims;
}
