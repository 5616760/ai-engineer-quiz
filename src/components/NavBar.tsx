'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Code2, ClipboardCheck, Sparkles, ScrollText, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const ITEMS = [
  { href: '/', label: '首页', icon: Brain },
  { href: '/theory', label: '理论刷题', icon: Sparkles },
  { href: '/coding', label: '实操代码', icon: Code2 },
  { href: '/exam', label: '模拟考', icon: ClipboardCheck },
  { href: '/cheat', label: '速记卡', icon: ScrollText },
  { href: '/settings', label: '设置', icon: Settings },
];

export default function NavBar() {
  const path = usePathname();
  return (
    <nav
      className="sticky top-0 z-50 no-print"
      style={{
        background: 'linear-gradient(135deg, #0a4f4a 0%, #0f766e 60%, #115e59 100%)',
        borderBottom: '1px solid rgba(255,255,255,.12)',
        boxShadow: '0 4px 20px rgba(10, 79, 74, .25)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
        {/* Logo 区 */}
        <Link href="/" className="flex items-center gap-2.5 mr-2 shrink-0">
          <span
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg"
            style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              boxShadow: '0 4px 12px rgba(20, 184, 166, .4), inset 0 1px 0 rgba(255,255,255,.2)',
            }}
          >
            <Brain size={20} className="text-white" strokeWidth={2.2} />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-white font-bold text-base tracking-tight">AI 工程师竞赛</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-teal-200/80 mt-0.5">Exam Prep · 2026</span>
          </div>
        </Link>

        {/* 主导航 */}
        <div className="flex flex-1 overflow-x-auto ml-2">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? path === '/' : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm whitespace-nowrap transition-colors"
                style={{
                  color: active ? '#fff' : 'rgba(255,255,255,.78)',
                  background: active ? 'rgba(255,255,255,.14)' : 'transparent',
                  fontWeight: active ? 600 : 500,
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,.08)'; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon size={14} />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* 右侧：比赛倒计时 chip + 主题切换 */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: 'rgba(245, 158, 11, .22)',
              border: '1px solid rgba(245, 158, 11, .45)',
              color: '#fcd34d',
            }}
          >
            🏆 2026-09-24
          </span>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}