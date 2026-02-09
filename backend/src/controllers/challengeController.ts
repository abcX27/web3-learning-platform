import { Request, Response } from 'express';
import { ChallengeService } from '../services/challengeService';
import Joi from 'joi';
import { Difficulty } from '@prisma/client';

export class ChallengeController {
  /**
   * Get all challenges
   */
  static async getChallenges(req: Request, res: Response) {
    try {
      const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(50).default(10),
        difficulty: Joi.string()
          .valid(...Object.values(Difficulty))
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

      const userId = (req as any).user?.id;
      const result = await ChallengeService.getChallenges({
        ...value,
        userId,
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
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
  static async getChallengeById(req: Request, res: Response) {
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

      const userId = (req as any).user?.id;
      const challenge = await ChallengeService.getChallengeById(
        challengeId,
        userId
      );

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
    } catch (error: any) {
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
  static async submitChallenge(req: Request, res: Response) {
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

      const schema = Joi.object({
        code: Joi.string().required().max(50000),
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

      const userId = (req as any).user.id;
      const result = await ChallengeService.submitChallenge({
        challengeId,
        userId,
        code: value.code,
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
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
  static async getSubmissions(req: Request, res: Response) {
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

      const userId = (req as any).user.id;
      const submissions = await ChallengeService.getSubmissions(
        challengeId,
        userId
      );

      return res.json({
        success: true,
        data: { submissions },
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: {
          message: error.message || 'Failed to fetch submissions',
        },
      });
    }
  }
}
