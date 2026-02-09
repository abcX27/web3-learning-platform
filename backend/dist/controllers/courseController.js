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
exports.getCourses = getCourses;
exports.getCourseById = getCourseById;
exports.getCourseChapters = getCourseChapters;
exports.getChapterById = getChapterById;
exports.searchCourses = searchCourses;
exports.markChapterComplete = markChapterComplete;
const courseService = __importStar(require("../services/courseService"));
/**
 * Get all courses with pagination and filters
 * GET /api/courses
 */
async function getCourses(req, res, next) {
    try {
        const query = {
            page: req.query.page ? parseInt(req.query.page) : undefined,
            limit: req.query.limit ? parseInt(req.query.limit) : undefined,
            search: req.query.search,
            level: req.query.level,
            status: req.query.status,
        };
        const result = await courseService.getCourses(query);
        res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get course by ID
 * GET /api/courses/:id
 */
async function getCourseById(req, res, next) {
    try {
        const courseId = parseInt(req.params.id);
        if (isNaN(courseId)) {
            return next(new Error('Invalid course ID'));
        }
        const course = await courseService.getCourseById(courseId);
        res.json({
            success: true,
            data: { course },
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get course chapters
 * GET /api/courses/:id/chapters
 */
async function getCourseChapters(req, res, next) {
    try {
        const courseId = parseInt(req.params.id);
        if (isNaN(courseId)) {
            return next(new Error('Invalid course ID'));
        }
        const userId = req.user?.userId;
        const chapters = await courseService.getCourseChapters(courseId, userId);
        res.json({
            success: true,
            data: { chapters },
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Get chapter by ID
 * GET /api/chapters/:id
 */
async function getChapterById(req, res, next) {
    try {
        const chapterId = parseInt(req.params.id);
        if (isNaN(chapterId)) {
            return next(new Error('Invalid chapter ID'));
        }
        const userId = req.user?.userId;
        const chapter = await courseService.getChapterById(chapterId, userId);
        res.json({
            success: true,
            data: { chapter },
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Search courses
 * GET /api/courses/search
 */
async function searchCourses(req, res, next) {
    try {
        const searchTerm = req.query.q;
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        if (!searchTerm) {
            res.json({
                success: true,
                data: { courses: [] },
            });
            return;
        }
        const courses = await courseService.searchCourses(searchTerm, limit);
        res.json({
            success: true,
            data: { courses },
        });
    }
    catch (error) {
        next(error);
    }
}
/**
 * Mark chapter as complete
 * POST /api/chapters/:id/complete
 */
async function markChapterComplete(req, res, next) {
    try {
        const chapterId = parseInt(req.params.id);
        if (isNaN(chapterId)) {
            return next(new Error('Invalid chapter ID'));
        }
        if (!req.user) {
            return next(new Error('User not authenticated'));
        }
        const result = await courseService.markChapterComplete(req.user.userId, chapterId);
        res.json({
            success: true,
            data: result,
            message: '章节已标记为完成',
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=courseController.js.map