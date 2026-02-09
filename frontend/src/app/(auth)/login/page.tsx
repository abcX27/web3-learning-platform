'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { ethers } from 'ethers';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', formData);
      
      if (response.success && response.data) {
        // Set user and token together in Zustand store
        setUser(response.data.user, response.data.token);
        router.push('/courses');
      }
    } catch (err: any) {
      setError(err.error?.message || '登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        setError('请先安装 MetaMask 钱包');
        setIsLoading(false);
        return;
      }

      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const walletAddress = accounts[0];

      // Create message to sign
      const message = `欢迎登录 Web3 学习平台！\n\n请签名以验证你的钱包地址。\n\n钱包地址: ${walletAddress}\n时间戳: ${Date.now()}`;

      // Request signature
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      // Send to backend for verification
      const response = await api.post('/api/auth/wallet-login', {
        walletAddress,
        signature,
        message,
      });

      if (response.success && response.data) {
        // Set user and token together in Zustand store
        setUser(response.data.user, response.data.token);
        router.push('/courses');
      }
    } catch (err: any) {
      if (err.code === 4001) {
        setError('用户拒绝了签名请求');
      } else {
        setError(err.error?.message || '钱包登录失败，请重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">登录</CardTitle>
          <CardDescription className="text-center">
            登录到 Web3 学习平台
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                邮箱
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                密码
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 text-center">{error}</div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                或
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleWalletLogin}
            disabled={isLoading}
          >
            <svg
              className="mr-2 h-4 w-4"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32.5 8.5L21.5 1.5L10.5 8.5V15.5L21.5 22.5L32.5 15.5V8.5Z"
                fill="#E17726"
                stroke="#E17726"
                strokeWidth="0.5"
              />
              <path
                d="M21.5 22.5L10.5 15.5V22.5L21.5 29.5L32.5 22.5V15.5L21.5 22.5Z"
                fill="#E27625"
                stroke="#E27625"
                strokeWidth="0.5"
              />
            </svg>
            使用 MetaMask 登录
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-center text-muted-foreground">
            还没有账号？{' '}
            <Link href="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
