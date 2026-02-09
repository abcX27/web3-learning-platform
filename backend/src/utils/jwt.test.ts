import jwt from 'jsonwebtoken';
import {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
  refreshToken,
  TokenPayload,
} from './jwt';
import { AppError } from '../middleware/errorHandler';

// Mock environment variables
const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    JWT_SECRET: 'test-secret-key',
    JWT_EXPIRES_IN: '1h',
  };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('JWT Utilities', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const payload: TokenPayload = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };

      const token = generateToken(payload);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include user information in token payload', () => {
      const payload: TokenPayload = {
        userId: 123,
        email: 'user@example.com',
        role: 'ADMIN',
      };

      const token = generateToken(payload);
      const decoded = jwt.verify(token, 'test-secret-key') as any;

      expect(decoded.userId).toBe(123);
      expect(decoded.email).toBe('user@example.com');
      expect(decoded.role).toBe('ADMIN');
    });

    it('should generate token with wallet address', () => {
      const payload: TokenPayload = {
        userId: 456,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        role: 'USER',
      };

      const token = generateToken(payload);
      const decoded = jwt.verify(token, 'test-secret-key') as any;

      expect(decoded.userId).toBe(456);
      expect(decoded.walletAddress).toBe('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
      expect(decoded.role).toBe('USER');
    });

    it('should set expiration time', () => {
      const payload: TokenPayload = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };

      const token = generateToken(payload);
      const decoded = jwt.verify(token, 'test-secret-key') as any;

      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode a valid token', () => {
      const payload: TokenPayload = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };

      const token = generateToken(payload);
      const decoded = verifyToken(token);

      expect(decoded.userId).toBe(1);
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.role).toBe('USER');
    });

    it('should throw AppError for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => verifyToken(invalidToken)).toThrow(AppError);
      expect(() => verifyToken(invalidToken)).toThrow('Token 无效');
    });

    it('should throw AppError for expired token', () => {
      const payload: TokenPayload = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };

      // Generate token that expires immediately
      const expiredToken = jwt.sign(payload, 'test-secret-key', { expiresIn: '0s' });

      // Wait a bit to ensure expiration
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(() => verifyToken(expiredToken)).toThrow(AppError);
          expect(() => verifyToken(expiredToken)).toThrow('Token 已过期');
          resolve(undefined);
        }, 100);
      });
    });

    it('should throw AppError for token with wrong secret', () => {
      const payload: TokenPayload = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };

      const token = jwt.sign(payload, 'wrong-secret', { expiresIn: '1h' });

      expect(() => verifyToken(token)).toThrow(AppError);
    });
  });

  describe('extractTokenFromHeader', () => {
    it('should extract token from valid Bearer header', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const authHeader = `Bearer ${token}`;

      const extracted = extractTokenFromHeader(authHeader);

      expect(extracted).toBe(token);
    });

    it('should return null for undefined header', () => {
      const extracted = extractTokenFromHeader(undefined);

      expect(extracted).toBeNull();
    });

    it('should return null for empty header', () => {
      const extracted = extractTokenFromHeader('');

      expect(extracted).toBeNull();
    });

    it('should return null for header without Bearer prefix', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const extracted = extractTokenFromHeader(token);

      expect(extracted).toBeNull();
    });

    it('should return null for malformed Bearer header', () => {
      const extracted = extractTokenFromHeader('Bearer');

      expect(extracted).toBeNull();
    });

    it('should return null for header with wrong prefix', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
      const authHeader = `Basic ${token}`;

      const extracted = extractTokenFromHeader(authHeader);

      expect(extracted).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should generate new token with same payload', () => {
      const payload: TokenPayload = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };

      const originalToken = generateToken(payload);
      
      // Wait a bit to ensure different iat
      return new Promise((resolve) => {
        setTimeout(() => {
          const newToken = refreshToken(originalToken);

          expect(newToken).toBeDefined();
          expect(newToken).not.toBe(originalToken);

          const decoded = verifyToken(newToken);
          expect(decoded.userId).toBe(payload.userId);
          expect(decoded.email).toBe(payload.email);
          expect(decoded.role).toBe(payload.role);

          resolve(undefined);
        }, 1000);
      });
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => refreshToken(invalidToken)).toThrow(AppError);
    });

    it('should preserve wallet address in refreshed token', () => {
      const payload: TokenPayload = {
        userId: 1,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        role: 'USER',
      };

      const originalToken = generateToken(payload);
      const newToken = refreshToken(originalToken);

      const decoded = verifyToken(newToken);
      expect(decoded.walletAddress).toBe(payload.walletAddress);
    });
  });
});
