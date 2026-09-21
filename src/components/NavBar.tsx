'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Code2, ClipboardCheck, Sparkles, ScrollText, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const ITEMS = [
  { href: '/', label: '首页', icon: Brain },
  { href: '/theory', label: '理论', icon: Sparkles },
  { href: '/coding', label: '实操', icon: Code2 },
  { href: '/exam', label: '模拟考', icon: ClipboardCheck },
  { href: '/cheat', label: '速记', icon: ScrollText },
  { href: '/settings', label: '设置', icon: Settings },
];

export default function NavBar() {
  const path = usePathname();
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md no-print" style={{ background: 'color-mix(in srgb, var(--bg) 85%, transparent)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-1">
        <Link href="/" className="flex items-center gap-2 font-semibold mr-4">
          <Brain size={18} className="text-[color:var(--brand)]" />
          <span className="hidden sm:inline">AI 工程竞赛备考</span>
          <span className="sm:hidden">AI</span>
        </Link>
        <div className="flex flex-1 overflow-x-auto">
          {ITEMS.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? path === '/' : path.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm whitespace-nowrap ${active ? 'bg-[color:var(--bg-muted)] font-medium' : 'hover:bg-[color:var(--bg-muted)]'}`}
                style={active ? { color: 'var(--brand)' } : {}}
              >
                <Icon size={14} />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}
        </div>
        <ThemeToggle />
      </div>
    </nav>
  );
}