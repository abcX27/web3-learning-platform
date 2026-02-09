'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface UserStats {
  totalCourses: number;
  completedCourses: number;
  totalChallenges: number;
  completedChallenges: number;
  totalBadges: number;
  totalHours: number;
  courseProgress: Array<{
    courseId: number;
    totalChapters: number;
    completedChapters: number;
    progress: number;
  }>;
}

interface UserProfile {
  id: number;
  email: string;
  username: string;
  avatarUrl?: string;
  bio?: string;
  walletAddress?: string;
  role: string;
  createdAt: string;
  stats?: UserStats;
}

export default function ProfilePage() {
  const updateUser = useAuthStore((state) => state.updateUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    avatarUrl: '',
    bio: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/auth/me');
      
      if (response.success && response.data) {
        setProfile(response.data.user);
        setFormData({
          username: response.data.user.username || '',
          avatarUrl: response.data.user.avatarUrl || '',
          bio: response.data.user.bio || '',
        });
      }
    } catch (err: any) {
      setError(err.error?.message || '加载个人资料失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      // Clean up the data before sending
      const dataToSend: any = {};
      
      if (formData.username && formData.username.trim()) {
        dataToSend.username = formData.username.trim();
      }
      
      if (formData.avatarUrl && formData.avatarUrl.trim()) {
        dataToSend.avatarUrl = formData.avatarUrl.trim();
      }
      
      if (formData.bio !== undefined) {
        dataToSend.bio = formData.bio.trim();
      }

      console.log('Sending profile update:', dataToSend);
      const response = await api.put('/api/auth/profile', dataToSend);
      
      if (response.success && response.data) {
        setProfile(response.data.user);
        // Update the user in the auth store
        updateUser(response.data.user);
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.error?.message || '更新个人资料失败');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: profile?.username || '',
      avatarUrl: profile?.avatarUrl || '',
      bio: profile?.bio || '',
    });
    setIsEditing(false);
    setError('');
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

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500">加载个人资料失败</p>
          <Button onClick={fetchProfile} className="mt-4">
            重试
          </Button>
        </div>
      </div>
    );
  }

  const stats = profile.stats || {
    totalCourses: 0,
    completedCourses: 0,
    totalChallenges: 0,
    completedChallenges: 0,
    totalBadges: 0,
    totalHours: 0,
    courseProgress: [],
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">个人中心</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>个人信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="relative">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.username}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">
                        {profile.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* User Info */}
              {!isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">用户名</label>
                    <p className="text-lg">{profile.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">邮箱</label>
                    <p className="text-sm">{profile.email}</p>
                  </div>
                  {profile.walletAddress && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">钱包地址</label>
                      <p className="text-sm font-mono break-all">
                        {profile.walletAddress.slice(0, 6)}...{profile.walletAddress.slice(-4)}
                      </p>
                    </div>
                  )}
                  {profile.bio && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">个人简介</label>
                      <p className="text-sm">{profile.bio}</p>
                    </div>
                  )}
                  <Button onClick={() => setIsEditing(true)} className="w-full" type="button">
                    编辑资料
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label htmlFor="username" className="text-sm font-medium">
                      用户名
                    </label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div>
                    <label htmlFor="avatarUrl" className="text-sm font-medium">
                      头像 URL
                    </label>
                    <Input
                      id="avatarUrl"
                      name="avatarUrl"
                      value={formData.avatarUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/avatar.jpg (可选)"
                      disabled={isSaving}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      留空则使用默认头像，或参考 <a href="/AVATAR_UPLOAD_GUIDE.md" target="_blank" className="text-primary hover:underline">头像上传指南</a>
                    </p>
                  </div>
                  <div>
                    <label htmlFor="bio" className="text-sm font-medium">
                      个人简介
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                      placeholder="介绍一下自己..."
                      disabled={isSaving}
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.bio.length}/500
                    </p>
                  </div>
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={isSaving} className="flex-1" type="button">
                      {isSaving ? '保存中...' : '保存'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      disabled={isSaving}
                      className="flex-1"
                      type="button"
                    >
                      取消
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Statistics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{stats.totalCourses}</p>
                  <p className="text-sm text-muted-foreground mt-1">学习课程</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">{stats.completedCourses}</p>
                  <p className="text-sm text-muted-foreground mt-1">完成课程</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">{stats.totalChallenges}</p>
                  <p className="text-sm text-muted-foreground mt-1">挑战题目</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{stats.completedChallenges}</p>
                  <p className="text-sm text-muted-foreground mt-1">完成挑战</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">{stats.totalBadges}</p>
                  <p className="text-sm text-muted-foreground mt-1">获得徽章</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">{stats.totalHours}</p>
                  <p className="text-sm text-muted-foreground mt-1">学习时长(小时)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Course Progress */}
          {stats.courseProgress.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>课程进度</CardTitle>
                <CardDescription>你正在学习的课程</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.courseProgress.map((course) => (
                  <div key={course.courseId} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>课程 #{course.courseId}</span>
                      <span className="text-muted-foreground">
                        {course.completedChapters}/{course.totalChapters} 章节
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-primary h-2.5 rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right text-muted-foreground">
                      {course.progress}% 完成
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Badges Section - Placeholder */}
          {stats.totalBadges > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>我的徽章</CardTitle>
                <CardDescription>你获得的成就徽章</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                  {Array.from({ length: Math.min(stats.totalBadges, 12) }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center"
                    >
                      <span className="text-2xl">🏆</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
