"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const challengeController_1 = require("../controllers/challengeController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Get all challenges (optional auth to show user progress)
router.get('/', auth_1.optionalAuthenticate, challengeController_1.ChallengeController.getChallenges);
// Get challenge by ID (optional auth to show user progress)
router.get('/:id', auth_1.optionalAuthenticate, challengeController_1.ChallengeController.getChallengeById);
// Submit solution (requires auth)
router.post('/:id/submit', auth_1.authenticate, challengeController_1.ChallengeController.submitChallenge);
// Get user's submissions (requires auth)
router.get('/:id/submissions', auth_1.authenticate, challengeController_1.ChallengeController.getSubmissions);
exports.default = router;
//# sourceMappingURL=challenges.js.map