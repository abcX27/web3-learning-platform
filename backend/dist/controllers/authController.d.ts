import { Request, Response, NextFunction } from 'express';
/**
 * Register a new user
 * POST /api/auth/register
 */
export declare function register(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Login user with email and password
 * POST /api/auth/login
 */
export declare function login(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Login with wallet
 * POST /api/auth/wallet-login
 */
export declare function walletLogin(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Get current user information
 * GET /api/auth/me
 */
export declare function getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Update user profile
 * PUT /api/auth/profile
 */
export declare function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Logout user
 * POST /api/auth/logout
 */
export declare function logout(req: Request, res: Response): Promise<void>;
//# sourceMappingURL=authController.d.ts.map