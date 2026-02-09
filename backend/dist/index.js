"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const logger_1 = __importDefault(require("./utils/logger"));
const requestLogger_1 = require("./middleware/requestLogger");
const errorHandler_1 = require("./middleware/errorHandler");
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
// Trust proxy (important for rate limiting and getting real IP behind reverse proxy)
app.set('trust proxy', 1);
// Security middleware - Helmet
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    crossOriginEmbedderPolicy: false,
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
}));
// Compression middleware
app.use((0, compression_1.default)({
    level: 6,
    threshold: 1024, // Only compress responses larger than 1KB
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression_1.default.filter(req, res);
    },
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Request logging middleware
app.use(requestLogger_1.requestLogger);
// Health check endpoint (before other routes)
app.get('/health', (_req, res) => {
    res.status(200).json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
        },
    });
});
// Root endpoint
app.get('/', (_req, res) => {
    res.json({
        success: true,
        data: {
            message: 'Web3 Learning Platform API',
            version: '1.0.0',
            status: 'running',
            documentation: '/api/docs',
        },
    });
});
// API routes will be added here
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const courses_1 = __importDefault(require("./routes/courses"));
const chapters_1 = __importDefault(require("./routes/chapters"));
const editor_1 = __importDefault(require("./routes/editor"));
const challenges_1 = __importDefault(require("./routes/challenges"));
app.use('/api/auth', auth_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/courses', courses_1.default);
app.use('/api/chapters', chapters_1.default);
app.use('/api/editor', editor_1.default);
app.use('/api/challenges', challenges_1.default);
// etc.
// 404 handler - must be after all routes
app.use(errorHandler_1.notFoundHandler);
// Global error handler - must be last
app.use(errorHandler_1.errorHandler);
// Graceful shutdown handler
const gracefulShutdown = () => {
    logger_1.default.info('Received shutdown signal, closing server gracefully...');
    process.exit(0);
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
// Start server
const server = app.listen(PORT, () => {
    logger_1.default.info(`🚀 Server is running on port ${PORT}`);
    logger_1.default.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger_1.default.info(`🔗 Health check: http://localhost:${PORT}/health`);
    logger_1.default.info(`🌐 API Base URL: http://localhost:${PORT}/api`);
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    logger_1.default.error('Unhandled Promise Rejection:', reason);
    // Close server and exit process
    server.close(() => {
        process.exit(1);
    });
});
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger_1.default.error('Uncaught Exception:', error);
    // Close server and exit process
    server.close(() => {
        process.exit(1);
    });
});
exports.default = app;
//# sourceMappingURL=index.js.map