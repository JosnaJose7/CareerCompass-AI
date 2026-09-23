import { Router, Response } from 'express';
import { verifyFirebaseToken, setUserCustomRole } from '../authService';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { logger } from '../services/logger';

const router = Router();

// Verifies user authorization server-side without trusting client claims or profile fields
router.post('/auth/verify-role', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({
        role: 'student',
        isFaculty: false,
        isAdmin: false,
        authenticated: false,
        message: 'Unauthenticated or guest request. Granted default student access.'
      });
    }

    const token = authHeader.split('Bearer ')[1].trim();
    const verified = await verifyFirebaseToken(token);
    if (!verified) {
      return res.status(401).json({
        error: 'Invalid or expired Firebase Auth token',
        code: 'UNAUTHENTICATED',
        role: 'student',
        isFaculty: false,
        isAdmin: false
      });
    }

    return res.json({
      uid: verified.uid,
      email: verified.email,
      role: verified.role,
      isFaculty: verified.isFaculty,
      isAdmin: verified.isAdmin,
      emailVerified: verified.emailVerified,
      verifiedVia: verified.verifiedVia
    });
  } catch (err: any) {
    logger.error('Error in /api/auth/verify-role:', err);
    return res.status(500).json({
      error: 'Failed to verify user authorization role',
      code: 'SERVER_ERROR'
    });
  }
});

// Admin-only endpoint to set custom user claims
router.post('/admin/set-user-role', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { targetUid, role } = req.body;
    if (!targetUid || !role || !['student', 'faculty', 'admin'].includes(role)) {
      return res.status(400).json({
        error: 'targetUid and a valid role ("student" | "faculty" | "admin") are required',
        code: 'INVALID_REQUEST'
      });
    }

    const updatedClaims = await setUserCustomRole(targetUid, role);
    logger.info('User custom role updated by admin', {
      adminUid: req.user?.uid,
      targetUid,
      assignedRole: role
    });

    return res.json({
      success: true,
      message: `User ${targetUid} role successfully updated to ${role}`,
      claims: updatedClaims
    });
  } catch (err: any) {
    logger.error('Error setting custom user role:', err, { adminUid: req.user?.uid });
    return res.status(500).json({
      error: 'Internal error updating user role credentials',
      code: 'SERVER_ERROR'
    });
  }
});

export default router;
