import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
        <div className="text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Web3 学习平台
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            从零开始学习区块链和 Web3 开发技术
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            系统化的学习路径 · 理论与实践结合 · 即时反馈验证 · 社区互动支持
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/courses">
              <Button size="lg" className="text-lg px-8">
                开始学习
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="text-lg px-8">
                查看课程
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            平台特色
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">📚</span>
                  系统化学习
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  从区块链基础到智能合约开发，再到 DApp 实战，完整的学习路径助你成为 Web3 开发者
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">💻</span>
                  在线编辑器
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  内置 Solidity 和 JavaScript 编辑器，支持代码编译、合约部署和实时测试
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">🎯</span>
                  实战练习
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  丰富的编程挑战和项目实战，通过实践巩固所学知识，提升开发能力
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">👥</span>
                  社区支持
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  活跃的学习社区，随时提问讨论，分享学习笔记，与其他开发者共同成长
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">🏆</span>
                  成就系统
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  完成课程和挑战获得徽章，查看学习排行榜，激励自己持续进步
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-3xl">🔗</span>
                  Web3 集成
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  支持 MetaMask 钱包登录，直接与区块链交互，体验真实的 Web3 开发环境
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            准备好开始你的 Web3 学习之旅了吗？
          </h2>
          <p className="text-xl mb-8 opacity-90">
            立即注册，免费开始学习区块链和智能合约开发
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                免费注册
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent text-white border-white hover:bg-white/10">
                立即登录
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-background">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Web3 Learning Platform. All rights reserved.</p>
          <p className="mt-2">
            Built with Next.js 14, TypeScript, and Tailwind CSS
          </p>
        </div>
      </footer>
    </main>
  );
}
