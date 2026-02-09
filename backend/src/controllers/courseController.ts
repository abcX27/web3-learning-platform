import { Request, Response, NextFunction } from 'express';
import * as courseService from '../services/courseService';

/**
 * Get all courses with pagination and filters
 * GET /api/courses
 */
export async function getCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string) : undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      search: req.query.search as string,
      level: req.query.level as string,
      status: req.query.status as string,
    };

    const result = await courseService.getCourses(query);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get course by ID
 * GET /api/courses/:id
 */
export async function getCourseById(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  } catch (error) {
    next(error);
  }
}

/**
 * Get course chapters
 * GET /api/courses/:id/chapters
 */
export async function getCourseChapters(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  } catch (error) {
    next(error);
  }
}

/**
 * Get chapter by ID
 * GET /api/chapters/:id
 */
export async function getChapterById(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  } catch (error) {
    next(error);
  }
}

/**
 * Search courses
 * GET /api/courses/search
 */
export async function searchCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const searchTerm = req.query.q as string;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

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
  } catch (error) {
    next(error);
  }
}

/**
 * Mark chapter as complete
 * POST /api/chapters/:id/complete
 */
export async function markChapterComplete(req: Request, res: Response, next: NextFunction): Promise<void> {
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
  } catch (error) {
    next(error);
  }
}
