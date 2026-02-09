"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.asyncHandler = exports.errorHandler = exports.AppError = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Custom application error class
 */
class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(statusCode, code, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = 'AppError';
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
/**
 * Global error handling middleware
 * Catches all errors and returns a standardized error response
 */
const errorHandler = (err, req, res, _next) => {
    // Generate request ID for tracking
    const requestId = req.headers['x-request-id'] || `req_${Date.now()}`;
    // Log error details
    logger_1.default.error({
        requestId,
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
    });
    // Handle custom AppError
    if (err instanceof AppError) {
        const response = {
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
            },
        };
        res.status(err.statusCode).json(response);
        return;
    }
    // Handle Prisma errors
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        let statusCode = 400;
        let code = 'DATABASE_ERROR';
        let message = 'Database operation failed';
        let details = undefined;
        switch (err.code) {
            case 'P2002':
                // Unique constraint violation
                code = 'DUPLICATE_ERROR';
                message = 'A record with this value already exists';
                details = { field: err.meta?.target };
                break;
            case 'P2025':
                // Record not found
                statusCode = 404;
                code = 'NOT_FOUND';
                message = 'The requested resource was not found';
                break;
            case 'P2003':
                // Foreign key constraint violation
                code = 'FOREIGN_KEY_ERROR';
                message = 'Related record does not exist';
                details = { field: err.meta?.field_name };
                break;
            case 'P2014':
                // Invalid ID
                code = 'INVALID_ID';
                message = 'The provided ID is invalid';
                break;
            default:
                message = process.env.NODE_ENV === 'production'
                    ? 'Database operation failed'
                    : err.message;
        }
        const response = {
            success: false,
            error: { code, message, details },
        };
        res.status(statusCode).json(response);
        return;
    }
    // Handle Prisma validation errors
    if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        const response = {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Invalid data provided',
                details: process.env.NODE_ENV === 'production' ? undefined : err.message,
            },
        };
        res.status(400).json(response);
        return;
    }
    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        const response = {
            success: false,
            error: {
                code: 'INVALID_TOKEN',
                message: 'Invalid authentication token',
            },
        };
        res.status(401).json(response);
        return;
    }
    if (err.name === 'TokenExpiredError') {
        const response = {
            success: false,
            error: {
                code: 'TOKEN_EXPIRED',
                message: 'Authentication token has expired',
            },
        };
        res.status(401).json(response);
        return;
    }
    // Handle validation errors (from Joi or similar)
    if (err.name === 'ValidationError') {
        const response = {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: err.message,
            },
        };
        res.status(400).json(response);
        return;
    }
    // Handle syntax errors (malformed JSON)
    if (err instanceof SyntaxError && 'body' in err) {
        const response = {
            success: false,
            error: {
                code: 'INVALID_JSON',
                message: 'Invalid JSON in request body',
            },
        };
        res.status(400).json(response);
        return;
    }
    // Default error response (500 Internal Server Error)
    const response = {
        success: false,
        error: {
            code: 'INTERNAL_ERROR',
            message: process.env.NODE_ENV === 'production'
                ? 'An internal server error occurred'
                : err.message,
            requestId,
        },
    };
    res.status(500).json(response);
};
exports.errorHandler = errorHandler;
/**
 * Async handler wrapper to catch errors in async route handlers
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
/**
 * 404 Not Found handler
 * Should be placed after all routes
 */
const notFoundHandler = (req, res) => {
    const response = {
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.url} not found`,
        },
    };
    res.status(404).json(response);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map