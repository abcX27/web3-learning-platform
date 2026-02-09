import { Request, Response, NextFunction } from 'express';
/**
 * Get all courses with pagination and filters
 * GET /api/courses
 */
export declare function getCourses(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Get course by ID
 * GET /api/courses/:id
 */
export declare function getCourseById(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Get course chapters
 * GET /api/courses/:id/chapters
 */
export declare function getCourseChapters(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Get chapter by ID
 * GET /api/chapters/:id
 */
export declare function getChapterById(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Search courses
 * GET /api/courses/search
 */
export declare function searchCourses(req: Request, res: Response, next: NextFunction): Promise<void>;
/**
 * Mark chapter as complete
 * POST /api/chapters/:id/complete
 */
export declare function markChapterComplete(req: Request, res: Response, next: NextFunction): Promise<void>;
//# sourceMappingURL=courseController.d.ts.map