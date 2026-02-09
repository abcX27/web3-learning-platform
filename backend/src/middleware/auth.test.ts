import { Request, Response, NextFunction } from 'express';
import {
  authenticate,
  optionalAuthenticate,
  requireRole,
  requireAdmin,
  requireSelfOrAdmin,
} from './auth';
import { generateToken, TokenPayload } from '../utils/jwt';
import { AppError } from './errorHandler';

// Mock environment variables
const originalEnv = process.env;

beforeAll(() => {
  process.env = {
    ...originalEnv,
    JWT_SECRET: 'test-secret-key',
    JWT_EXPIRES_IN: '1h',
  };
});

afterAll(() => {
  process.env = originalEnv;
});

// Helper function to create mock request
function createMockRequest(authHeader?: string, params?: any): Partial<Request> {
  return {
    headers: {
      authorization: authHeader,
    },
    params: params || {},
  };
}

// Helper function to create mock response
function createMockResponse(): Partial<Response> {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

// Helper function to create mock next
function createMockNext(): NextFunction {
  return jest.fn();
}

describe('Authentication Middleware', () => {
  describe('authenticate', () => {
    it('should authenticate valid token and attach user to request', () => {
      const payload: TokenPayload = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };
      const token = generateToken(payload);

      const req = createMockRequest(`Bearer ${token}`) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      authenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user?.userId).toBe(1);
      expect(req.user?.email).toBe('test@example.com');
      expect(req.user?.role).toBe('USER');
      expect(next).toHaveBeenCalledWith();
    });

    it('should call next with error for missing token', () => {
      const req = createMockRequest() as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
      expect(error.code).toBe('UNAUTHORIZED');
    });

    it('should call next with error for invalid token', () => {
      const req = createMockRequest('Bearer invalid.token.here') as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it('should call next with error for malformed authorization header', () => {
      const req = createMockRequest('InvalidFormat token') as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      authenticate(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });

    it('should authenticate admin user', () => {
      const payload: TokenPayload = {
        userId: 2,
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      const token = generateToken(payload);

      const req = createMockRequest(`Bearer ${token}`) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      authenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user?.role).toBe('ADMIN');
      expect(next).toHaveBeenCalledWith();
    });

    it('should authenticate wallet user', () => {
      const payload: TokenPayload = {
        userId: 3,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
        role: 'USER',
      };
      const token = generateToken(payload);

      const req = createMockRequest(`Bearer ${token}`) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      authenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user?.walletAddress).toBe('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb');
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('optionalAuthenticate', () => {
    it('should attach user if valid token is provided', () => {
      const payload: TokenPayload = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };
      const token = generateToken(payload);

      const req = createMockRequest(`Bearer ${token}`) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      optionalAuthenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user?.userId).toBe(1);
      expect(next).toHaveBeenCalledWith();
    });

    it('should proceed without user if no token is provided', () => {
      const req = createMockRequest() as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      optionalAuthenticate(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });

    it('should proceed without user if invalid token is provided', () => {
      const req = createMockRequest('Bearer invalid.token') as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      optionalAuthenticate(req, res, next);

      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('requireRole', () => {
    it('should allow access for user with required role', () => {
      const req = createMockRequest() as Request;
      req.user = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      const middleware = requireRole('USER');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should deny access for user without required role', () => {
      const req = createMockRequest() as Request;
      req.user = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      const middleware = requireRole('ADMIN');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(403);
      expect(error.code).toBe('FORBIDDEN');
    });

    it('should allow access for user with any of multiple allowed roles', () => {
      const req = createMockRequest() as Request;
      req.user = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      const middleware = requireRole(['USER', 'ADMIN']);
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should deny access for unauthenticated user', () => {
      const req = createMockRequest() as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      const middleware = requireRole('USER');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });
  });

  describe('requireAdmin', () => {
    it('should allow access for admin user', () => {
      const req = createMockRequest() as Request;
      req.user = {
        userId: 1,
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      requireAdmin(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should deny access for non-admin user', () => {
      const req = createMockRequest() as Request;
      req.user = {
        userId: 1,
        email: 'user@example.com',
        role: 'USER',
      };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      requireAdmin(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(403);
    });
  });

  describe('requireSelfOrAdmin', () => {
    it('should allow user to access their own resource', () => {
      const req = createMockRequest(undefined, { userId: '1' }) as Request;
      req.user = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      const middleware = requireSelfOrAdmin('userId');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should deny user from accessing other user resource', () => {
      const req = createMockRequest(undefined, { userId: '2' }) as Request;
      req.user = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      const middleware = requireSelfOrAdmin('userId');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(403);
    });

    it('should allow admin to access any user resource', () => {
      const req = createMockRequest(undefined, { userId: '999' }) as Request;
      req.user = {
        userId: 1,
        email: 'admin@example.com',
        role: 'ADMIN',
      };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      const middleware = requireSelfOrAdmin('userId');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });

    it('should deny unauthenticated user', () => {
      const req = createMockRequest(undefined, { userId: '1' }) as Request;
      const res = createMockResponse() as Response;
      const next = createMockNext();

      const middleware = requireSelfOrAdmin('userId');
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      const error = (next as jest.Mock).mock.calls[0][0];
      expect(error.statusCode).toBe(401);
    });

    it('should use default parameter name if not specified', () => {
      const req = createMockRequest(undefined, { userId: '1' }) as Request;
      req.user = {
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
      };
      const res = createMockResponse() as Response;
      const next = createMockNext();

      const middleware = requireSelfOrAdmin();
      middleware(req, res, next);

      expect(next).toHaveBeenCalledWith();
    });
  });
});
