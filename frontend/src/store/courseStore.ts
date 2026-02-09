import { create } from 'zustand';
import { Course, Chapter, Level } from '@/types/course';

interface CourseState {
  courses: Course[];
  currentCourse: Course | null;
  currentChapter: Chapter | null;
  isLoading: boolean;
  error: string | null;
  
  // Filters
  levelFilter: Level | null;
  searchQuery: string;
  
  // Actions
  setCourses: (courses: Course[]) => void;
  setCurrentCourse: (course: Course | null) => void;
  setCurrentChapter: (chapter: Chapter | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setLevelFilter: (level: Level | null) => void;
  setSearchQuery: (query: string) => void;
  markChapterComplete: (chapterId: number) => void;
  clearFilters: () => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  courses: [],
  currentCourse: null,
  currentChapter: null,
  isLoading: false,
  error: null,
  levelFilter: null,
  searchQuery: '',

  setCourses: (courses) => set({ courses }),

  setCurrentCourse: (course) => set({ currentCourse: course }),

  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),

  setLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  setLevelFilter: (level) => set({ levelFilter: level }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  markChapterComplete: (chapterId) =>
    set((state) => ({
      currentChapter:
        state.currentChapter?.id === chapterId
          ? { ...state.currentChapter, isCompleted: true }
          : state.currentChapter,
    })),

  clearFilters: () =>
    set({
      levelFilter: null,
      searchQuery: '',
    }),
}));
