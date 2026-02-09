"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.extractTokenFromHeader = extractTokenFromHeader;
exports.refreshToken = refreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../middleware/errorHandler");
/**
 * JWT Configuration
 */
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
/**
 * Generate JWT token for a user
 * @param payload - User information to encode in the token
 * @returns JWT token string
 */
function generateToken(payload) {
    if (!JWT_SECRET || JWT_SECRET === 'default-secret-change-in-production') {
        console.warn('WARNING: Using default JWT secret. Please set JWT_SECRET in production!');
    }
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
}
/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded token payload
 * @throws AppError if token is invalid or expired
 */
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new errorHandler_1.AppError(401, 'TOKEN_EXPIRED', 'Token 已过期，请重新登录');
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new errorHandler_1.AppError(401, 'INVALID_TOKEN', 'Token 无效');
        }
        throw new errorHandler_1.AppError(401, 'UNAUTHORIZED', '认证失败');
    }
}
/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
function extractTokenFromHeader(authHeader) {
    if (!authHeader) {
        return null;
    }
    // Expected format: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }
    return parts[1];
}
/**
 * Refresh token by generating a new one with updated expiration
 * @param token - Current valid token
 * @returns New JWT token
 */
function refreshToken(token) {
    const decoded = verifyToken(token);
    // Generate new token with same payload but new expiration
    return generateToken({
        userId: decoded.userId,
        email: decoded.email,
        walletAddress: decoded.walletAddress,
        role: decoded.role,
    });
}
//# sourceMappingURL=jwt.js.map