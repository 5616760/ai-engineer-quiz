import './globals.css';
import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'AI 工程竞赛备考 · v1',
  description: '北京职工职业技能大赛 · 人工智能工程技术人员竞赛（2026）｜初赛备考',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
        <footer className="max-w-6xl mx-auto px-4 py-6 text-xs text-[color:var(--fg-muted)] border-t" style={{ borderColor: 'var(--border)' }}>
          © 2026 AI 工程竞赛备考 · 仅供学习用途 · 数据源自公开题库
        </footer>
      </body>
    </html>
  );
}