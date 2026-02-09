import { Request, Response } from 'express';
export declare class ChallengeController {
    /**
     * Get all challenges
     */
    static getChallenges(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get challenge by ID
     */
    static getChallengeById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Submit solution to challenge
     */
    static submitChallenge(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Get user's submissions for a challenge
     */
    static getSubmissions(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=challengeController.d.ts.map