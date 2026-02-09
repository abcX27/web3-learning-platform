import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../utils/jwt';
/**
 * Extend Express Request to include user information
 */
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
/**
 * Authentication middleware
 * Verifies JWT token and attaches user information to request
 *
 * Usage:
 * router.get('/protected', authenticate, controller.method);
 */
export declare function authenticate(req: Request, _res: Response, next: NextFunction): void;
/**
 * Optional authentication middleware
 * Attaches user information if token is present, but doesn't require it
 *
 * Usage:
 * router.get('/public-or-private', optionalAuthenticate, controller.method);
 */
export declare function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void;
/**
 * Role-based access control middleware
 * Requires user to have specific role(s)
 *
 * Usage:
 * router.post('/admin/courses', authenticate, requireRole('ADMIN'), controller.method);
 * router.post('/content', authenticate, requireRole(['USER', 'ADMIN']), controller.method);
 *
 * @param roles - Single role or array of allowed roles
 */
export declare function requireRole(roles: 'USER' | 'ADMIN' | Array<'USER' | 'ADMIN'>): (req: Request, _res: Response, next: NextFunction) => void;
/**
 * Admin-only middleware
 * Shorthand for requireRole('ADMIN')
 *
 * Usage:
 * router.post('/admin/courses', authenticate, requireAdmin, controller.method);
 */
export declare function requireAdmin(req: Request, res: Response, next: NextFunction): void;
/**
 * Self-or-admin middleware
 * Allows access if user is accessing their own resource or is an admin
 *
 * Usage:
 * router.get('/users/:userId/profile', authenticate, requireSelfOrAdmin('userId'), controller.method);
 *
 * @param userIdParam - Name of the route parameter containing the user ID
 */
export declare function requireSelfOrAdmin(userIdParam?: string): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map