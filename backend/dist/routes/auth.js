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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const authController = __importStar(require("../controllers/authController"));
const validation_1 = require("../utils/validation");
const router = (0, express_1.Router)();
/**
 * Authentication routes
 */
// Public routes - no authentication required
router.post('/register', (0, validation_1.validate)(validation_1.registerSchema), authController.register);
router.post('/login', (0, validation_1.validate)(validation_1.loginSchema), authController.login);
router.post('/wallet-login', (0, validation_1.validate)(validation_1.walletLoginSchema), authController.walletLogin);
// Protected routes - requires authentication
router.get('/me', auth_1.authenticate, authController.getCurrentUser);
router.put('/profile', auth_1.authenticate, (0, validation_1.validate)(validation_1.updateProfileSchema), authController.updateProfile);
router.post('/logout', auth_1.authenticate, authController.logout);
// Optional authentication - works with or without token
router.get('/public-content', auth_1.optionalAuthenticate, (req, res) => {
    res.json({
        success: true,
        data: {
            message: 'This is public content',
            isAuthenticated: !!req.user,
            user: req.user || null,
        },
    });
});
// Refresh token (placeholder for future implementation)
router.post('/refresh-token', auth_1.authenticate, (_req, res) => {
    res.status(501).json({
        success: false,
        error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Token refresh endpoint will be implemented later',
        },
    });
});
exports.default = router;
//# sourceMappingURL=auth.js.map