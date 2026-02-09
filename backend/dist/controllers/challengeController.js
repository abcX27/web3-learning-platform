"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeController = void 0;
const challengeService_1 = require("../services/challengeService");
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
class ChallengeController {
    /**
     * Get all challenges
     */
    static async getChallenges(req, res) {
        try {
            const schema = joi_1.default.object({
                page: joi_1.default.number().integer().min(1).default(1),
                limit: joi_1.default.number().integer().min(1).max(50).default(10),
                difficulty: joi_1.default.string()
                    .valid(...Object.values(client_1.Difficulty))
                    .optional(),
            });
            const { error, value } = schema.validate(req.query);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: error.details[0].message,
                    },
                });
            }
            const userId = req.user?.id;
            const result = await challengeService_1.ChallengeService.getChallenges({
                ...value,
                userId,
            });
            return res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: {
                    message: error.message || 'Failed to fetch challenges',
                },
            });
        }
    }
    /**
     * Get challenge by ID
     */
    static async getChallengeById(req, res) {
        try {
            const challengeId = parseInt(req.params.id);
            if (isNaN(challengeId)) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid challenge ID',
                    },
                });
            }
            const userId = req.user?.id;
            const challenge = await challengeService_1.ChallengeService.getChallengeById(challengeId, userId);
            if (!challenge) {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: 'Challenge not found',
                    },
                });
            }
            return res.json({
                success: true,
                data: { challenge },
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: {
                    message: error.message || 'Failed to fetch challenge',
                },
            });
        }
    }
    /**
     * Submit solution to challenge
     */
    static async submitChallenge(req, res) {
        try {
            const challengeId = parseInt(req.params.id);
            if (isNaN(challengeId)) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid challenge ID',
                    },
                });
            }
            const schema = joi_1.default.object({
                code: joi_1.default.string().required().max(50000),
            });
            const { error, value } = schema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: error.details[0].message,
                    },
                });
            }
            const userId = req.user.id;
            const result = await challengeService_1.ChallengeService.submitChallenge({
                challengeId,
                userId,
                code: value.code,
            });
            return res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: {
                    message: error.message || 'Failed to submit challenge',
                },
            });
        }
    }
    /**
     * Get user's submissions for a challenge
     */
    static async getSubmissions(req, res) {
        try {
            const challengeId = parseInt(req.params.id);
            if (isNaN(challengeId)) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid challenge ID',
                    },
                });
            }
            const userId = req.user.id;
            const submissions = await challengeService_1.ChallengeService.getSubmissions(challengeId, userId);
            return res.json({
                success: true,
                data: { submissions },
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: {
                    message: error.message || 'Failed to fetch submissions',
                },
            });
        }
    }
}
exports.ChallengeController = ChallengeController;
//# sourceMappingURL=challengeController.js.map