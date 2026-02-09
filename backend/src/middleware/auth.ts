import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { verifyToken, extractTokenFromHeader, TokenPayload } from '../utils/jwt';

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
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      throw new AppError(401, 'UNAUTHORIZED', '未授权访问，请先登录');
    }

    // Verify token and decode payload
    const decoded = verifyToken(token);

    // Attach user information to request
    req.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Optional authentication middleware
 * Attaches user information if token is present, but doesn't require it
 * 
 * Usage:
 * router.get('/public-or-private', optionalAuthenticate, controller.method);
 */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail on invalid tokens
    // Just proceed without user information
    next();
  }
}

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
export function requireRole(roles: 'USER' | 'ADMIN' | Array<'USER' | 'ADMIN'>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      // Ensure user is authenticated
      if (!req.user) {
        throw new AppError(401, 'UNAUTHORIZED', '未授权访问，请先登录');
      }

      // Normalize roles to array
      const allowedRoles = Array.isArray(roles) ? roles : [roles];

      // Check if user has required role
      if (!allowedRoles.includes(req.user.role)) {
        throw new AppError(403, 'FORBIDDEN', '您没有权限执行此操作');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Admin-only middleware
 * Shorthand for requireRole('ADMIN')
 * 
 * Usage:
 * router.post('/admin/courses', authenticate, requireAdmin, controller.method);
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  requireRole('ADMIN')(req, res, next);
}

/**
 * Self-or-admin middleware
 * Allows access if user is accessing their own resource or is an admin
 * 
 * Usage:
 * router.get('/users/:userId/profile', authenticate, requireSelfOrAdmin('userId'), controller.method);
 * 
 * @param userIdParam - Name of the route parameter containing the user ID
 */
export function requireSelfOrAdmin(userIdParam: string = 'userId') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AppError(401, 'UNAUTHORIZED', '未授权访问，请先登录');
      }

      const targetUserId = parseInt(req.params[userIdParam], 10);

      // Allow if user is admin or accessing their own resource
      if (req.user.role === 'ADMIN' || req.user.userId === targetUserId) {
        next();
      } else {
        throw new AppError(403, 'FORBIDDEN', '您只能访问自己的资源');
      }
    } catch (error) {
      next(error);
    }
  };
}
