import { Router } from 'express';
import { optionalAuthenticate } from '../middleware/auth';
import * as courseController from '../controllers/courseController';

const router = Router();

/**
 * Course routes
 */

// Public routes - no authentication required, but can include user data if authenticated
router.get('/', optionalAuthenticate, courseController.getCourses);
router.get('/search', optionalAuthenticate, courseController.searchCourses);
router.get('/:id', optionalAuthenticate, courseController.getCourseById);
router.get('/:id/chapters', optionalAuthenticate, courseController.getCourseChapters);

export default router;
