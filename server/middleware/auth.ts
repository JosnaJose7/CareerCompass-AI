import { Request, Response, NextFunction } from 'express';
import { verifyFirebaseToken, VerifiedAuthUser } from '../authService';
import { logger } from '../services/logger';

export interface AuthenticatedRequest extends Request {
  user?: VerifiedAuthUser | {
    uid: string;
    email: string | null;
    role: 'student' | 'faculty' | 'admin';
    isFaculty: boolean;
    isAdmin: boolean;
    isGuest: boolean;
    claims: Record<string, any>;
  };
}

/**
 * Extracts and verifies Firebase Bearer token if present
 */
async function extractAndVerifyToken(req: Request): Promise<VerifiedAuthUser | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split('Bearer ')[1].trim();
  if (!token) {
    return null;
  }
  return await verifyFirebaseToken(token);
}

/**
 * Middleware requiring a valid Firebase Auth bearer token (HTTP 401 on failure)
 */
export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Unauthenticated access attempt on protected endpoint', {
      route: req.path,
      method: req.method,
      ip: req.ip
    });
    return res.status(401).json({ 
      error: 'Authentication required. Please sign in with your student or university account.',
      code: 'UNAUTHENTICATED'
    });
  }

  const token = authHeader.split('Bearer ')[1].trim();
  const verified = await verifyFirebaseToken(token);

  if (!verified) {
    logger.warn('Rejected invalid or expired authentication token', {
      route: req.path,
      method: req.method,
      ip: req.ip
    });
    return res.status(401).json({ 
      error: 'Invalid or expired authentication token. Please sign in again.',
      code: 'UNAUTHENTICATED'
    });
  }

  req.user = verified;
  next();
}

/**
 * Middleware supporting both authenticated students and guest users.
 * If token is provided, it validates it. If no token, marks as verified guest.
 */
export async function optionalAuthOrGuest(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split('Bearer ')[1].trim();
    if (token) {
      const verified = await verifyFirebaseToken(token);
      if (!verified) {
        return res.status(401).json({
          error: 'Authentication token is invalid or expired. Please sign in again or proceed in guest mode.',
          code: 'UNAUTHENTICATED'
        });
      }
      req.user = verified;
      return next();
    }
  }

  // Gracefully initialize guest context
  req.user = {
    uid: 'guest',
    email: null,
    role: 'student',
    isFaculty: false,
    isAdmin: false,
    isGuest: true,
    claims: {}
  };
  next();
}

/**
 * Middleware requiring verified faculty custom claim or directory standing (HTTP 401 / 403)
 */
export async function requireFaculty(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Authentication required. Please sign in with your faculty account.',
      code: 'UNAUTHENTICATED'
    });
  }

  const verified = await extractAndVerifyToken(req);
  if (!verified) {
    return res.status(401).json({ 
      error: 'Invalid or expired authentication token. Please sign in again.',
      code: 'UNAUTHENTICATED'
    });
  }

  if (!verified.isFaculty) {
    logger.warn('Unauthorized faculty access attempt', {
      route: req.path,
      uid: verified.uid,
      role: verified.role
    });
    return res.status(403).json({ 
      error: 'Forbidden: Verified faculty or career advisor authorization required.',
      code: 'FORBIDDEN_FACULTY_ONLY'
    });
  }

  req.user = verified;
  next();
}

/**
 * Middleware requiring verified administrator status (HTTP 401 / 403)
 */
export async function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'Authentication required. Please sign in with administrator credentials.',
      code: 'UNAUTHENTICATED'
    });
  }

  const verified = await extractAndVerifyToken(req);
  if (!verified) {
    return res.status(401).json({ 
      error: 'Invalid or expired authentication token. Please sign in again.',
      code: 'UNAUTHENTICATED'
    });
  }

  if (!verified.isAdmin) {
    logger.warn('Unauthorized administrator access attempt', {
      route: req.path,
      uid: verified.uid,
      role: verified.role
    });
    return res.status(403).json({ 
      error: 'Forbidden: Verified administrator authorization required.',
      code: 'FORBIDDEN_ADMIN_ONLY'
    });
  }

  req.user = verified;
  next();
}
