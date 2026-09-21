import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Brain } from 'lucide-react';
import NavBar from '@/components/NavBar';

export const metadata: Metadata = {
  title: 'AI 工程竞赛备考 · 2026',
  description: '北京职工职业技能大赛 · 人工智能工程技术人员竞赛（2026）｜初赛备考。覆盖理论 300 题、实操 6 套、模拟考与速记卡。',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

function Footer() {
  return (
    <footer
      className="mt-8 no-print"
      style={{
        background: 'linear-gradient(180deg, transparent 0%, color-mix(in srgb, var(--brand) 4%, var(--bg)) 100%)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-md"
              style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)' }}
            >
              <Brain size={16} className="text-white" strokeWidth={2.2} />
            </span>
            <div className="font-bold">AI 工程师竞赛备考</div>
          </div>
          <p className="text-xs text-[color:var(--fg-muted)] leading-relaxed">
            北京职工职业技能大赛 · 人工智能工程技术人员竞赛初赛复习工具。
          </p>
        </div>

        <FooterCol title="备考入口">
          <FooterLink href="/theory">理论刷题</FooterLink>
          <FooterLink href="/coding">实操代码</FooterLink>
          <FooterLink href="/exam">模拟考</FooterLink>
          <FooterLink href="/cheat">速记卡</FooterLink>
        </FooterCol>

        <FooterCol title="赛前必看">
          <FooterLink href="/rules">14 条比赛须知</FooterLink>
          <FooterLink href="/cheat">高频易错 Top 12</FooterLink>
          <FooterLink href="/theory?mode=wrong">错题本</FooterLink>
          <FooterLink href="/theory?mode=favorite">收藏题</FooterLink>
        </FooterCol>

        <FooterCol title="工具">
          <FooterLink href="/settings">设置 / 数据导入</FooterLink>
          <FooterLink href="https://github.com/5616760/ai-engineer-quiz" target="_blank">GitHub 仓库</FooterLink>
        </FooterCol>
      </div>

      <div
        className="border-t"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-[color:var(--fg-muted)] flex flex-col sm:flex-row justify-between gap-2">
          <div>© 2026 AI 工程师竞赛备考 · 仅供学习用途 · 数据源自公开题库</div>
          <div>比赛日期 2026-09-24 · 周四 · 朝阳区双营路</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--fg-muted)] mb-3">{title}</div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FooterLink({ href, children, target }: { href: string; children: React.ReactNode; target?: string }) {
  return (
    <Link
      href={href}
      target={target}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      className="text-sm text-[color:var(--fg-muted)] hover:text-[color:var(--brand)] transition-colors"
      style={{ textDecoration: 'none' }}
    >
      {children}
    </Link>
  );
}