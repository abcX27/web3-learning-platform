import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

export class ChallengeService {
  /**
   * Get all challenges with optional filtering
   */
  static async getChallenges(params: {
    page?: number;
    limit?: number;
    difficulty?: Difficulty;
    userId?: number;
  }) {
    const { page = 1, limit = 10, difficulty, userId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (difficulty) {
      where.difficulty = difficulty;
    }

    const [challenges, total] = await Promise.all([
      prisma.challenge.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { submits: true },
          },
          ...(userId && {
            submits: {
              where: { userId },
              select: {
                id: true,
                passed: true,
                submittedAt: true,
              },
              orderBy: { submittedAt: 'desc' },
              take: 1,
            },
          }),
        },
      }),
      prisma.challenge.count({ where }),
    ]);

    return {
      challenges: challenges.map((challenge) => ({
        ...challenge,
        submissionCount: challenge._count.submits,
        userSubmission: userId && challenge.submits?.[0],
        _count: undefined,
        submits: undefined,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get challenge by ID
   */
  static async getChallengeById(id: number, userId?: number) {
    const challenge = await prisma.challenge.findUnique({
      where: { id },
      include: {
        _count: {
          select: { submits: true },
        },
        ...(userId && {
          submits: {
            where: { userId },
            orderBy: { submittedAt: 'desc' },
            take: 5,
          },
        }),
      },
    });

    if (!challenge) {
      return null;
    }

    // Check if user has passed the challenge
    const hasPassed = userId
      ? challenge.submits?.some((s: any) => s.passed)
      : false;

    return {
      ...challenge,
      submissionCount: challenge._count.submits,
      userSubmissions: challenge.submits || [],
      hasPassed,
      // Only show solution if user has passed
      solution: hasPassed ? challenge.solution : null,
      _count: undefined,
      submits: undefined,
    };
  }

  /**
   * Submit solution to challenge
   */
  static async submitChallenge(params: {
    challengeId: number;
    userId: number;
    code: string;
  }) {
    const { challengeId, userId, code } = params;

    // Get challenge with test cases
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Evaluate the submission (will be implemented in task 11.2)
    const evaluationResult = await this.evaluateSubmission(
      code,
      challenge.testCases as any
    );

    // Create submission record
    const submission = await prisma.challengeSubmit.create({
      data: {
        challengeId,
        userId,
        code,
        passed: evaluationResult.passed,
      },
    });

    return {
      submission,
      result: evaluationResult,
    };
  }

  /**
   * Get user's submissions for a challenge
   */
  static async getSubmissions(challengeId: number, userId: number) {
    const submissions = await prisma.challengeSubmit.findMany({
      where: {
        challengeId,
        userId,
      },
      orderBy: { submittedAt: 'desc' },
      take: 10,
    });

    return submissions;
  }

  /**
   * Evaluate submission (placeholder - will be implemented in task 11.2)
   */
  private static async evaluateSubmission(
    _code: string,
    testCases: Array<{ input: any; expected: any; description: string }>
  ): Promise<{
    passed: boolean;
    output: string;
    error?: string;
    testResults: Array<{
      description: string;
      passed: boolean;
      actual?: any;
      expected: any;
    }>;
  }> {
    // Placeholder implementation
    // Will be replaced with actual evaluation logic in task 11.2
    return {
      passed: false,
      output: 'Evaluation not yet implemented',
      testResults: testCases.map((tc) => ({
        description: tc.description,
        passed: false,
        expected: tc.expected,
      })),
    };
  }
}
