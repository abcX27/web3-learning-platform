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
export declare function getCourses(query: CourseListQuery): Promise<{
    courses: ({
        _count: {
            chapters: number;
        };
    } & {
        level: import(".prisma/client").$Enums.Level;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        orderIndex: number;
        description: string | null;
        duration: number | null;
        isPublished: boolean;
    })[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}>;
/**
 * Get course by ID
 */
export declare function getCourseById(courseId: number): Promise<{
    chapters: {
        id: number;
        title: string;
        orderIndex: number;
    }[];
} & {
    level: import(".prisma/client").$Enums.Level;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    orderIndex: number;
    description: string | null;
    duration: number | null;
    isPublished: boolean;
}>;
/**
 * Get course chapters
 */
export declare function getCourseChapters(courseId: number, userId?: number): Promise<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    courseId: number;
    title: string;
    content: string;
    orderIndex: number;
}[]>;
/**
 * Get chapter by ID
 */
export declare function getChapterById(chapterId: number, userId?: number): Promise<{
    progress: {
        userId: number;
        id: number;
        createdAt: Date;
        chapterId: number;
        completed: boolean;
        completedAt: Date | null;
    } | null;
    navigation: {
        prev: {
            id: number;
            orderIndex: number;
        } | null;
        next: {
            id: number;
            orderIndex: number;
        } | null;
    };
    course: {
        level: import(".prisma/client").$Enums.Level;
        id: number;
        title: string;
    };
    id: number;
    createdAt: Date;
    updatedAt: Date;
    courseId: number;
    title: string;
    content: string;
    orderIndex: number;
}>;
/**
 * Search courses
 */
export declare function searchCourses(searchTerm: string, limit?: number): Promise<{
    level: import(".prisma/client").$Enums.Level;
    id: number;
    title: string;
    description: string | null;
}[]>;
/**
 * Mark chapter as complete
 */
export declare function markChapterComplete(userId: number, chapterId: number): Promise<{
    progress: {
        userId: number;
        id: number;
        createdAt: Date;
        chapterId: number;
        completed: boolean;
        completedAt: Date | null;
    };
    courseProgress: {
        courseId: number;
        totalChapters: number;
        completedChapters: number;
        progress: number;
    };
}>;
//# sourceMappingURL=courseService.d.ts.map