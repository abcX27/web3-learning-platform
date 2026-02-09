import jwt from 'jsonwebtoken';
import { AppError } from '../middleware/errorHandler';

/**
 * JWT Token Payload Interface
 */
export interface TokenPayload {
  userId: number;
  email?: string;
  walletAddress?: string;
  role: 'USER' | 'ADMIN';
}

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
export function generateToken(payload: TokenPayload): string {
  if (!JWT_SECRET || JWT_SECRET === 'default-secret-change-in-production') {
    console.warn('WARNING: Using default JWT secret. Please set JWT_SECRET in production!');
  }

  return jwt.sign(
    payload,
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions
  );
}

/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded token payload
 * @throws AppError if token is invalid or expired
 */
export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(401, 'TOKEN_EXPIRED', 'Token 已过期，请重新登录');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(401, 'INVALID_TOKEN', 'Token 无效');
    }
    throw new AppError(401, 'UNAUTHORIZED', '认证失败');
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
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
export function refreshToken(token: string): string {
  const decoded = verifyToken(token);
  
  // Generate new token with same payload but new expiration
  return generateToken({
    userId: decoded.userId,
    email: decoded.email,
    walletAddress: decoded.walletAddress,
    role: decoded.role,
  });
}
