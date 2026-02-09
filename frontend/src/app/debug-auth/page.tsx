'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getAuthToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugAuthPage() {
  const { user, token, isAuthenticated } = useAuthStore();
  const [localStorageToken, setLocalStorageToken] = useState<string | null>(null);
  const [authStorageData, setAuthStorageData] = useState<any>(null);
  const [apiToken, setApiToken] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage
    const lsToken = localStorage.getItem('auth_token');
    setLocalStorageToken(lsToken);

    // Check auth-storage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        setAuthStorageData(JSON.parse(authStorage));
      } catch (e) {
        setAuthStorageData({ error: 'Parse error' });
      }
    }

    // Check API token getter
    setApiToken(getAuthToken());
  }, []);

  const handleClearAll = () => {
    localStorage.clear();
    useAuthStore.getState().logout();
    window.location.reload();
  };

  const handleTestLogin = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'debuguser@test.com',
          password: 'Debug1234',
        }),
      });

      const data = await response.json();
      if (data.success) {
        useAuthStore.getState().setUser(data.data.user, data.data.token);
        window.location.reload();
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">认证状态调试</h1>

      <div className="space-y-6">
        {/* Zustand Store */}
        <Card>
          <CardHeader>
            <CardTitle>Zustand Store 状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <strong>isAuthenticated:</strong>{' '}
              <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
                {isAuthenticated ? '✓ true' : '✗ false'}
              </span>
            </div>
            <div>
              <strong>token:</strong>{' '}
              <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">
                {token ? `${token.substring(0, 50)}...` : 'null'}
              </code>
            </div>
            <div>
              <strong>user:</strong>
              {user ? (
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              ) : (
                <span className="text-red-600"> null</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* localStorage auth_token */}
        <Card>
          <CardHeader>
            <CardTitle>localStorage.auth_token</CardTitle>
          </CardHeader>
          <CardContent>
            {localStorageToken ? (
              <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block overflow-auto">
                {localStorageToken.substring(0, 100)}...
              </code>
            ) : (
              <span className="text-red-600">Not found</span>
            )}
          </CardContent>
        </Card>

        {/* localStorage auth-storage */}
        <Card>
          <CardHeader>
            <CardTitle>localStorage.auth-storage (Zustand Persist)</CardTitle>
          </CardHeader>
          <CardContent>
            {authStorageData ? (
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
                {JSON.stringify(authStorageData, null, 2)}
              </pre>
            ) : (
              <span className="text-red-600">Not found</span>
            )}
          </CardContent>
        </Card>

        {/* API Token Getter */}
        <Card>
          <CardHeader>
            <CardTitle>getAuthToken() 返回值</CardTitle>
          </CardHeader>
          <CardContent>
            {apiToken ? (
              <code className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded block overflow-auto">
                {apiToken.substring(0, 100)}...
              </code>
            ) : (
              <span className="text-red-600">null</span>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>调试操作</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={handleTestLogin} className="w-full">
              测试登录 (debuguser@test.com)
            </Button>
            <Button onClick={handleClearAll} variant="destructive" className="w-full">
              清除所有认证数据
            </Button>
            <Button onClick={() => window.location.href = '/profile'} variant="outline" className="w-full">
              跳转到个人中心
            </Button>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>诊断步骤</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>检查 Zustand Store 中是否有 token 和 user</li>
              <li>检查 localStorage 中是否有 auth_token</li>
              <li>检查 auth-storage 中的数据是否正确</li>
              <li>检查 getAuthToken() 是否能正确获取 token</li>
              <li>如果都正常，打开浏览器控制台查看网络请求</li>
              <li>检查 /api/auth/me 请求的 Authorization header</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
