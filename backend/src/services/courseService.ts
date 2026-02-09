import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler';

const prisma = new PrismaClient();

/**
 * Course list query parameters
 */
export interface CourseListQuery {
  page?: number;
  limit?: number;
  search?: string;
  level?: string;
  status?: string;
}

/**
 * Get all courses with pagination and filters
 */
export async function getCourses(query: CourseListQuery) {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(50, Math.max(1, query.limit || 10));
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {};

  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.level) {
    where.level = query.level;
  }

  if (query.status) {
    where.status = query.status;
  }

  // Get total count
  const total = await prisma.course.count({ where });

  // Get courses
  const courses = await prisma.course.findMany({
    where,
    skip,
    take: limit,
    orderBy: { orderIndex: 'asc' },
    include: {
      _count: {
        select: { chapters: true },
      },
    },
  });

  return {
    courses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get course by ID
 */
export async function getCourseById(courseId: number) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      chapters: {
        orderBy: { orderIndex: 'asc' },
        select: {
          id: true,
          title: true,
          orderIndex: true,
        },
      },
    },
  });

  if (!course) {
    throw new AppError(404, 'COURSE_NOT_FOUND', '课程不存在');
  }

  return course;
}

/**
 * Get course chapters
 */
export async function getCourseChapters(courseId: number, userId?: number) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new AppError(404, 'COURSE_NOT_FOUND', '课程不存在');
  }

  const chapters = await prisma.chapter.findMany({
    where: { courseId },
    orderBy: { orderIndex: 'asc' },
  });

  // If user is provided, include progress
  if (userId) {
    const progress = await prisma.progress.findMany({
      where: {
        userId,
        chapterId: { in: chapters.map(c => c.id) },
      },
    });

    const progressMap = new Map(progress.map(p => [p.chapterId, p]));

    return chapters.map(chapter => ({
      ...chapter,
      progress: progressMap.get(chapter.id) || null,
    }));
  }

  return chapters;
}

/**
 * Get chapter by ID
 */
export async function getChapterById(chapterId: number, userId?: number) {
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          level: true,
        },
      },
    },
  });

  if (!chapter) {
    throw new AppError(404, 'CHAPTER_NOT_FOUND', '章节不存在');
  }

  // Get all chapters in the course for navigation
  const allChapters = await prisma.chapter.findMany({
    where: { courseId: chapter.courseId },
    orderBy: { orderIndex: 'asc' },
    select: {
      id: true,
      orderIndex: true,
    },
  });

  const currentIndex = allChapters.findIndex(c => c.id === chapterId);
  const prevChapter = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  // If user is provided, include progress
  let progress = null;
  if (userId) {
    progress = await prisma.progress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });
  }

  return {
    ...chapter,
    progress,
    navigation: {
      prev: prevChapter,
      next: nextChapter,
    },
  };
}

/**
 * Search courses
 */
export async function searchCourses(searchTerm: string, limit: number = 10) {
  const courses = await prisma.course.findMany({
    where: {
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    take: limit,
    orderBy: { orderIndex: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      level: true,
    },
  });

  return courses;
}

/**
 * Mark chapter as complete
 */
export async function markChapterComplete(userId: number, chapterId: number) {
  // Check if chapter exists
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: {
      course: true,
    },
  });

  if (!chapter) {
    throw new AppError(404, 'CHAPTER_NOT_FOUND', '章节不存在');
  }

  // Create or update progress
  const progress = await prisma.progress.upsert({
    where: {
      userId_chapterId: {
        userId,
        chapterId,
      },
    },
    update: {
      completed: true,
      completedAt: new Date(),
    },
    create: {
      userId,
      chapterId,
      completed: true,
      completedAt: new Date(),
    },
  });

  // Calculate course progress
  const allChapters = await prisma.chapter.findMany({
    where: { courseId: chapter.courseId },
  });

  const completedChapters = await prisma.progress.count({
    where: {
      userId,
      chapterId: { in: allChapters.map(c => c.id) },
      completed: true,
    },
  });

  const courseProgress = {
    courseId: chapter.courseId,
    totalChapters: allChapters.length,
    completedChapters,
    progress: allChapters.length > 0 ? Math.round((completedChapters / allChapters.length) * 100) : 0,
  };

  return {
    progress,
    courseProgress,
  };
}
