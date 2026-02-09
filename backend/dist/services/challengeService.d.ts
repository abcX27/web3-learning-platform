import { Difficulty } from '@prisma/client';
export declare class ChallengeService {
    /**
     * Get all challenges with optional filtering
     */
    static getChallenges(params: {
        page?: number;
        limit?: number;
        difficulty?: Difficulty;
        userId?: number;
    }): Promise<{
        challenges: {
            submissionCount: number;
            userSubmission: 0 | {
                userId: number;
                id: number;
                challengeId: number;
                code: string;
                passed: boolean;
                submittedAt: Date;
            } | undefined;
            _count: undefined;
            submits: undefined;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            title: string;
            description: string;
            difficulty: import(".prisma/client").$Enums.Difficulty;
            template: string;
            testCases: import("@prisma/client/runtime/library").JsonValue;
            solution: string;
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    /**
     * Get challenge by ID
     */
    static getChallengeById(id: number, userId?: number): Promise<{
        submissionCount: number;
        userSubmissions: {
            userId: number;
            id: number;
            challengeId: number;
            code: string;
            passed: boolean;
            submittedAt: Date;
        }[];
        hasPassed: boolean;
        solution: string | null;
        _count: undefined;
        submits: undefined;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        description: string;
        difficulty: import(".prisma/client").$Enums.Difficulty;
        template: string;
        testCases: import("@prisma/client/runtime/library").JsonValue;
    } | null>;
    /**
     * Submit solution to challenge
     */
    static submitChallenge(params: {
        challengeId: number;
        userId: number;
        code: string;
    }): Promise<{
        submission: {
            userId: number;
            id: number;
            challengeId: number;
            code: string;
            passed: boolean;
            submittedAt: Date;
        };
        result: {
            passed: boolean;
            output: string;
            error?: string;
            testResults: Array<{
                description: string;
                passed: boolean;
                actual?: any;
                expected: any;
            }>;
        };
    }>;
    /**
     * Get user's submissions for a challenge
     */
    static getSubmissions(challengeId: number, userId: number): Promise<{
        userId: number;
        id: number;
        challengeId: number;
        code: string;
        passed: boolean;
        submittedAt: Date;
    }[]>;
    /**
     * Evaluate submission (placeholder - will be implemented in task 11.2)
     */
    private static evaluateSubmission;
}
//# sourceMappingURL=challengeService.d.ts.map