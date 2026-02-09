"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("../utils/logger");
/**
 * Morgan HTTP request logger middleware
 * Logs all HTTP requests with method, URL, status, response time
 */
// Define custom token for response time in milliseconds
morgan_1.default.token('response-time-ms', (_req, res) => {
    const responseTime = res.getHeader('X-Response-Time');
    return responseTime ? `${responseTime}ms` : '-';
});
// Custom format for development
const devFormat = ':method :url :status :response-time ms - :res[content-length]';
// Custom format for production (JSON)
const prodFormat = JSON.stringify({
    method: ':method',
    url: ':url',
    status: ':status',
    contentLength: ':res[content-length]',
    responseTime: ':response-time',
    remoteAddr: ':remote-addr',
    userAgent: ':user-agent',
});
// Choose format based on environment
const format = process.env.NODE_ENV === 'production' ? prodFormat : devFormat;
// Create and export the middleware
exports.requestLogger = (0, morgan_1.default)(format, {
    stream: logger_1.stream,
    // Skip logging for health check endpoint to reduce noise
    skip: (req) => req.url === '/health',
});
//# sourceMappingURL=requestLogger.js.map