'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type Mode = 'system' | 'light' | 'dark';
const KEY = 'ai-exam/v1:theme';

function apply(mode: Mode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const effective = mode === 'system' ? (mql.matches ? 'dark' : 'light') : mode;
  root.classList.toggle('dark', effective === 'dark');
  root.dataset.theme = effective;
}

export default function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('system');

  useEffect(() => {
    const saved = (typeof localStorage !== 'undefined' ? localStorage.getItem(KEY) : null) as Mode | null;
    const m = saved || 'system';
    setMode(m);
    apply(m);
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => { if (mode === 'system') apply('system'); };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function next() {
    const order: Mode[] = ['system', 'light', 'dark'];
    const m = order[(order.indexOf(mode) + 1) % order.length];
    setMode(m);
    localStorage.setItem(KEY, m);
    apply(m);
  }

  const Icon = mode === 'light' ? Sun : Moon;
  const label = mode === 'system' ? '跟随系统' : mode === 'light' ? '浅色' : '深色';

  return (
    <button className="btn btn-ghost" onClick={next} title={`主题：${label}`} aria-label="切换主题">
      <Icon size={16} />
      <span className="hidden sm:inline text-xs">{label}</span>
    </button>
  );
}