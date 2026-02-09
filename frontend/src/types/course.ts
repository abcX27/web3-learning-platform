export enum Level {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface Course {
  id: number;
  title: string;
  description?: string;
  level: Level;
  duration?: number;
  orderIndex: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  chaptersCount?: number;
  completedChapters?: number;
  progress?: number;
}

export interface Chapter {
  id: number;
  courseId: number;
  title: string;
  content: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  isCompleted?: boolean;
  nextChapterId?: number;
  prevChapterId?: number;
}

export interface CourseWithChapters extends Course {
  chapters: Chapter[];
}

export interface CourseListParams {
  level?: Level;
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
