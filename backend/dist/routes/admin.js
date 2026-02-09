"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
/**
 * Admin routes - all require authentication and ADMIN role
 * These will be implemented in later tasks (Phase 3)
 */
// All admin routes require authentication
router.use(auth_1.authenticate);
// Course management - admin only
router.post('/courses', auth_1.requireAdmin, (_req, res) => {
    // Will be implemented in task 16.1
    res.status(501).json({
        success: false,
        error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Create course endpoint will be implemented in task 16.1',
        },
    });
});
router.put('/courses/:id', auth_1.requireAdmin, (_req, res) => {
    // Will be implemented in task 16.1
    res.status(501).json({
        success: false,
        error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Update course endpoint will be implemented in task 16.1',
        },
    });
});
router.delete('/courses/:id', auth_1.requireAdmin, (_req, res) => {
    // Will be implemented in task 16.1
    res.status(501).json({
        success: false,
        error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Delete course endpoint will be implemented in task 16.1',
        },
    });
});
// Chapter management - admin only
router.post('/chapters', auth_1.requireAdmin, (_req, res) => {
    // Will be implemented in task 16.1
    res.status(501).json({
        success: false,
        error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Create chapter endpoint will be implemented in task 16.1',
        },
    });
});
router.put('/chapters/:id', auth_1.requireAdmin, (_req, res) => {
    // Will be implemented in task 16.1
    res.status(501).json({
        success: false,
        error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Update chapter endpoint will be implemented in task 16.1',
        },
    });
});
router.delete('/chapters/:id', auth_1.requireAdmin, (_req, res) => {
    // Will be implemented in task 16.1
    res.status(501).json({
        success: false,
        error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Delete chapter endpoint will be implemented in task 16.1',
        },
    });
});
// File upload - admin only
router.post('/upload', auth_1.requireAdmin, (_req, res) => {
    // Will be implemented in task 16.3
    res.status(501).json({
        success: false,
        error: {
            code: 'NOT_IMPLEMENTED',
            message: 'File upload endpoint will be implemented in task 16.3',
        },
    });
});
// User management - admin only
router.get('/users', auth_1.requireAdmin, (_req, res) => {
    // Will be implemented in task 16.5
    res.status(501).json({
        success: false,
        error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Get users endpoint will be implemented in task 16.5',
        },
    });
});
router.put('/users/:id', auth_1.requireAdmin, (_req, res) => {
    // Will be implemented in task 16.5
    res.status(501).json({
        success: false,
        error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Update user endpoint will be implemented in task 16.5',
        },
    });
});
// Platform statistics - admin only
router.get('/stats', auth_1.requireAdmin, (_req, res) => {
    // Will be implemented in task 16.5
    res.status(501).json({
        success: false,
        error: {
            code: 'NOT_IMPLEMENTED',
            message: 'Get stats endpoint will be implemented in task 16.5',
        },
    });
});
// Example: Route that allows both USER and ADMIN
router.get('/reports', (0, auth_1.requireRole)(['USER', 'ADMIN']), (req, res) => {
    res.json({
        success: true,
        data: {
            message: 'This route is accessible by both USER and ADMIN roles',
            user: req.user,
        },
    });
});
exports.default = router;
//# sourceMappingURL=admin.js.map