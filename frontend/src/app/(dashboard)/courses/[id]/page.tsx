'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';

interface Chapter {
  id: number;
  title: string;
  orderIndex: number;
  progress?: {
    completed: boolean;
    completedAt: string | null;
  } | null;
}

interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: number;
  chapters: Chapter[];
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: '初级',
  INTERMEDIATE: '中级',
  ADVANCED: '高级',
};

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch course details
      const courseResponse = await api.get(`/api/courses/${courseId}`);
      if (courseResponse.success && courseResponse.data) {
        setCourse(courseResponse.data.course);
      }

      // Fetch chapters with progress
      const chaptersResponse = await api.get(`/api/courses/${courseId}/chapters`);
      if (chaptersResponse.success && chaptersResponse.data) {
        setChapters(chaptersResponse.data.chapters);
      }
    } catch (err: any) {
      setError(err.error?.message || '加载课程失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChapterClick = (chapterId: number) => {
    router.push(`/chapters/${chapterId}`);
  };

  const calculateProgress = () => {
    if (chapters.length === 0) return 0;
    const completedCount = chapters.filter(c => c.progress?.completed).length;
    return Math.round((completedCount / chapters.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || '课程不存在'}</p>
          <Button onClick={() => router.push('/courses')}>
            返回课程列表
          </Button>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Course Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/courses')}
          className="mb-4"
        >
          ← 返回课程列表
        </Button>
        
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-muted-foreground mb-4">{course.description}</p>
            <div className="flex items-center gap-4">
              <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary">
                {LEVEL_LABELS[course.level] || course.level}
              </span>
              <span className="text-sm text-muted-foreground">
                {chapters.length} 章节
              </span>
              {course.duration && (
                <span className="text-sm text-muted-foreground">
                  预计 {Math.round(course.duration / 60)} 小时
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {isAuthenticated && (
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">学习进度</span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
              <div
                className="bg-primary h-3 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Chapters List */}
      <div>
        <h2 className="text-2xl font-bold mb-4">课程章节</h2>
        
        {chapters.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              该课程暂无章节
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {chapters.map((chapter, index) => {
              const isCompleted = chapter.progress?.completed || false;
              
              return (
                <Card
                  key={chapter.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleChapterClick(chapter.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-muted-foreground">
                            第 {index + 1} 章
                          </span>
                          {isCompleted && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              ✓ 已完成
                            </span>
                          )}
                        </div>
                        <CardTitle className="text-lg mt-1">
                          {chapter.title}
                        </CardTitle>
                      </div>
                      <Button variant="ghost" size="sm">
                        开始学习 →
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Call to Action */}
      {!isAuthenticated && (
        <Card className="mt-8 bg-primary/5">
          <CardContent className="py-6 text-center">
            <p className="text-lg mb-4">登录后可以跟踪学习进度</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => router.push('/login')}>
                登录
              </Button>
              <Button variant="outline" onClick={() => router.push('/register')}>
                注册
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
