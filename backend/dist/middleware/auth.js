"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.optionalAuthenticate = optionalAuthenticate;
exports.requireRole = requireRole;
exports.requireAdmin = requireAdmin;
exports.requireSelfOrAdmin = requireSelfOrAdmin;
const errorHandler_1 = require("./errorHandler");
const jwt_1 = require("../utils/jwt");
/**
 * Authentication middleware
 * Verifies JWT token and attaches user information to request
 *
 * Usage:
 * router.get('/protected', authenticate, controller.method);
 */
function authenticate(req, _res, next) {
    try {
        // Extract token from Authorization header
        const token = (0, jwt_1.extractTokenFromHeader)(req.headers.authorization);
        if (!token) {
            throw new errorHandler_1.AppError(401, 'UNAUTHORIZED', '未授权访问，请先登录');
        }
        // Verify token and decode payload
        const decoded = (0, jwt_1.verifyToken)(token);
        // Attach user information to request
        req.user = decoded;
        next();
    }
    catch (error) {
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
function optionalAuthenticate(req, _res, next) {
    try {
        const token = (0, jwt_1.extractTokenFromHeader)(req.headers.authorization);
        if (token) {
            const decoded = (0, jwt_1.verifyToken)(token);
            req.user = decoded;
        }
        next();
    }
    catch (error) {
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
function requireRole(roles) {
    return (req, _res, next) => {
        try {
            // Ensure user is authenticated
            if (!req.user) {
                throw new errorHandler_1.AppError(401, 'UNAUTHORIZED', '未授权访问，请先登录');
            }
            // Normalize roles to array
            const allowedRoles = Array.isArray(roles) ? roles : [roles];
            // Check if user has required role
            if (!allowedRoles.includes(req.user.role)) {
                throw new errorHandler_1.AppError(403, 'FORBIDDEN', '您没有权限执行此操作');
            }
            next();
        }
        catch (error) {
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
function requireAdmin(req, res, next) {
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
function requireSelfOrAdmin(userIdParam = 'userId') {
    return (req, _res, next) => {
        try {
            if (!req.user) {
                throw new errorHandler_1.AppError(401, 'UNAUTHORIZED', '未授权访问，请先登录');
            }
            const targetUserId = parseInt(req.params[userIdParam], 10);
            // Allow if user is admin or accessing their own resource
            if (req.user.role === 'ADMIN' || req.user.userId === targetUserId) {
                next();
            }
            else {
                throw new errorHandler_1.AppError(403, 'FORBIDDEN', '您只能访问自己的资源');
            }
        }
        catch (error) {
            next(error);
        }
    };
}
//# sourceMappingURL=auth.js.map