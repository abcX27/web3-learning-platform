import { Router } from 'express';
import { ChallengeController } from '../controllers/challengeController';
import { optionalAuthenticate, authenticate } from '../middleware/auth';

const router = Router();

// Get all challenges (optional auth to show user progress)
router.get('/', optionalAuthenticate, ChallengeController.getChallenges);

// Get challenge by ID (optional auth to show user progress)
router.get('/:id', optionalAuthenticate, ChallengeController.getChallengeById);

// Submit solution (requires auth)
router.post('/:id/submit', authenticate, ChallengeController.submitChallenge);

// Get user's submissions (requires auth)
router.get('/:id/submissions', authenticate, ChallengeController.getSubmissions);

export default router;
