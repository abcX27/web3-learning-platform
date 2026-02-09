'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { MobileMenu } from './MobileMenu';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuthStore();

  const navItems = [
    { href: '/courses', label: '课程' },
    { href: '/challenges', label: '挑战' },
    { href: '/editor', label: '编辑器' },
    { href: '/community', label: '社区' },
  ];

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl">🔗</span>
          <span className="font-bold text-xl hidden sm:inline-block">
            Web3 学习平台
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                isActive(item.href)
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons & Mobile Menu */}
        <div className="flex items-center space-x-2">
          {isAuthenticated && user ? (
            <>
              <Link href="/profile" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  {user.username}
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout} className="hidden sm:flex">
                退出
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  登录
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button size="sm">注册</Button>
              </Link>
            </>
          )}
          
          {/* Mobile Menu */}
          <MobileMenu items={navItems} />
        </div>
      </div>
    </header>
  );
}
