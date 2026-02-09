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
 * Generate JWT token for a user
 * @param payload - User information to encode in the token
 * @returns JWT token string
 */
export declare function generateToken(payload: TokenPayload): string;
/**
 * Verify and decode JWT token
 * @param token - JWT token string
 * @returns Decoded token payload
 * @throws AppError if token is invalid or expired
 */
export declare function verifyToken(token: string): TokenPayload;
/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string or null
 */
export declare function extractTokenFromHeader(authHeader: string | undefined): string | null;
/**
 * Refresh token by generating a new one with updated expiration
 * @param token - Current valid token
 * @returns New JWT token
 */
export declare function refreshToken(token: string): string;
//# sourceMappingURL=jwt.d.ts.map