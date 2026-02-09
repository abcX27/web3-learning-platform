import { Router } from 'express';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import * as authController from '../controllers/authController';
import { validate, registerSchema, loginSchema, walletLoginSchema, updateProfileSchema } from '../utils/validation';

const router = Router();

/**
 * Authentication routes
 */

// Public routes - no authentication required
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/wallet-login', validate(walletLoginSchema), authController.walletLogin);

// Protected routes - requires authentication
router.get('/me', authenticate, authController.getCurrentUser);
router.put('/profile', authenticate, validate(updateProfileSchema), authController.updateProfile);
router.post('/logout', authenticate, authController.logout);

// Optional authentication - works with or without token
router.get('/public-content', optionalAuthenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'This is public content',
      isAuthenticated: !!req.user,
      user: req.user || null,
    },
  });
});

// Refresh token (placeholder for future implementation)
router.post('/refresh-token', authenticate, (_req, res) => {
  res.status(501).json({
    success: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Token refresh endpoint will be implemented later',
    },
  });
});

export default router;
