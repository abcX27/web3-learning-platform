'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Chapter {
  id: number;
  title: string;
  content: string;
  courseId: number;
  course: {
    id: number;
    title: string;
    level: string;
  };
  progress?: {
    completed: boolean;
    completedAt: string | null;
  } | null;
  navigation: {
    prev: { id: number } | null;
    next: { id: number } | null;
  };
}

export default function ChapterDetailPage() {
  const router = useRouter();
  const params = useParams();
  const chapterId = params.id as string;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChapterDetails();
  }, [chapterId]);

  const fetchChapterDetails = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await api.get(`/api/chapters/${chapterId}`);
      if (response.success && response.data) {
        setChapter(response.data.chapter);
      }
    } catch (err: any) {
      setError(err.error?.message || '加载章节失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      setIsCompleting(true);
      const response = await api.post(`/api/chapters/${chapterId}/complete`);
      
      if (response.success) {
        // Refresh chapter data to update completion status
        await fetchChapterDetails();
      }
    } catch (err: any) {
      console.error('Failed to mark chapter as complete:', err);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (!chapter) return;
    
    const targetChapter = direction === 'prev' 
      ? chapter.navigation.prev 
      : chapter.navigation.next;
    
    if (targetChapter) {
      router.push(`/chapters/${targetChapter.id}`);
    }
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

  if (error || !chapter) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || '章节不存在'}</p>
          <Button onClick={() => router.push('/courses')}>
            返回课程列表
          </Button>
        </div>
      </div>
    );
  }

  const isCompleted = chapter.progress?.completed || false;

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/courses/${chapter.courseId}`)}
          className="mb-4"
        >
          ← 返回课程
        </Button>
        
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {chapter.course.title}
            </p>
            <h1 className="text-3xl font-bold">{chapter.title}</h1>
          </div>
          {isCompleted && (
            <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              ✓ 已完成
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <Card className="mb-6">
        <CardContent className="prose prose-slate dark:prose-invert max-w-none p-8">
          <ReactMarkdown
            components={{
              code(props) {
                const { node, className, children, ...rest } = props;
                const match = /language-(\w+)/.exec(className || '');
                const isInline = !match;
                
                return !isInline ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus as any}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...rest}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {chapter.content}
          </ReactMarkdown>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={() => handleNavigation('prev')}
          disabled={!chapter.navigation.prev}
        >
          ← 上一章
        </Button>

        {isAuthenticated && !isCompleted && (
          <Button
            onClick={handleMarkComplete}
            disabled={isCompleting}
          >
            {isCompleting ? '标记中...' : '标记为完成'}
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => handleNavigation('next')}
          disabled={!chapter.navigation.next}
        >
          下一章 →
        </Button>
      </div>

      {/* Login Prompt */}
      {!isAuthenticated && (
        <Card className="bg-primary/5">
          <CardContent className="py-6 text-center">
            <p className="text-lg mb-4">登录后可以标记章节为完成并跟踪学习进度</p>
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
