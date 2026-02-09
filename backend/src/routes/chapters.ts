import { Router } from 'express';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import * as courseController from '../controllers/courseController';

const router = Router();

/**
 * Chapter routes
 */

// Public routes - no authentication required, but can include user data if authenticated
router.get('/:id', optionalAuthenticate, courseController.getChapterById);

// Protected routes - requires authentication
router.post('/:id/complete', authenticate, courseController.markChapterComplete);

export default router;
