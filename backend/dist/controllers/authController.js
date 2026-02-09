"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.walletLogin = walletLogin;
exports.getCurrentUser = getCurrentUser;
exports.updateProfile = updateProfile;
exports.logout = logout;
const authService = __importStar(require("../services/authService"));
const logger_1 = __importDefault(require("../utils/logger"));
/**
 * Register a new user
 * POST /api/auth/register
 */
async function register(req, res, next) {
    try {
        const { email, password, username } = req.body;
        logger_1.default.info(`Registration attempt for email: ${email}`);
        const result = await authService.registerUser({
            email,
            password,
            username,
        });
        logger_1.default.info(`User registered successfully: ${result.user.id}`);
        res.status(201).json({
            success: true,
            data: result,
            message: '注册成功',
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Login user with email and password
 * POST /api/auth/login
 */
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        logger_1.default.info(`Login attempt for email: ${email}`);
        const result = await authService.loginUser({
            email,
            password,
        });
        logger_1.default.info(`User logged in successfully: ${result.user.id}`);
        res.json({
            success: true,
            data: result,
            message: '登录成功',
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Login with wallet
 * POST /api/auth/wallet-login
 */
async function walletLogin(req, res, next) {
    try {
        const { walletAddress, signature, message } = req.body;
        logger_1.default.info(`Wallet login attempt for address: ${walletAddress}`);
        const result = await authService.walletLogin({
            walletAddress,
            signature,
            message,
        });
        logger_1.default.info(`User logged in with wallet successfully: ${result.user.id}`);
        res.json({
            success: true,
            data: result,
            message: '钱包登录成功',
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get current user information
 * GET /api/auth/me
 */
async function getCurrentUser(req, res, next) {
    try {
        if (!req.user) {
            return next(new Error('User not authenticated'));
        }
        const user = await authService.getUserById(req.user.userId);
        res.json({
            success: true,
            data: { user },
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Update user profile
 * PUT /api/auth/profile
 */
async function updateProfile(req, res, next) {
    try {
        if (!req.user) {
            return next(new Error('User not authenticated'));
        }
        const { username, avatarUrl, bio } = req.body;
        const user = await authService.updateUserProfile(req.user.userId, {
            username,
            avatarUrl,
            bio,
        });
        logger_1.default.info(`User profile updated: ${user.id}`);
        res.json({
            success: true,
            data: { user },
            message: '个人资料更新成功',
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Logout user
 * POST /api/auth/logout
 */
async function logout(req, res) {
    // In a JWT-based system, logout is typically handled client-side
    // by removing the token. However, we can log the event.
    if (req.user) {
        logger_1.default.info(`User logged out: ${req.user.userId}`);
    }
    res.json({
        success: true,
        message: '登出成功',
    });
}
//# sourceMappingURL=authController.js.map