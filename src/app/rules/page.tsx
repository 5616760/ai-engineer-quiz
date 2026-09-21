'use client';

import { useMemo, useState } from 'react';
import { Search, ScrollText } from 'lucide-react';
import PageHero from '@/components/PageHero';
import PrintButton from '@/components/PrintButton';
import { contest } from '@/data';

export default function RulesPage() {
  const [kw, setKw] = useState('');
  const filtered = useMemo(() => {
    if (!kw.trim()) return contest.rules;
    const k = kw.toLowerCase();
    return contest.rules.filter((r) => r.text.toLowerCase().includes(k));
  }, [kw]);

  return (
    <div className="space-y-4">
      <PageHero
        icon={<ScrollText size={24} className="text-white" strokeWidth={2.2} />}
        eyebrow="赛前必读 · 14 条"
        title="比赛须知"
        subtitle="《关于 2026 年北京市职工职业技能大赛人工智能工程技术人员竞赛初赛的通知》要点摘录，关键词检索。"
        right={<PrintButton />}
      />
      <section className="card card-elevated no-print">
        <div className="flex gap-2">
          <div
            className="flex-1 flex items-center gap-2 px-3 rounded-md border"
            style={{ borderColor: 'var(--border-strong)' }}
          >
            <Search size={14} className="text-[color:var(--fg-muted)]" />
            <input
              type="text"
              value={kw}
              onChange={(e) => setKw(e.target.value)}
              placeholder="如：迟到 / 作弊 / 手机 / 交卷 / 身份证"
              className="flex-1 py-2 bg-transparent outline-none text-sm"
            />
          </div>
        </div>
        {kw && (
          <div className="text-xs text-[color:var(--fg-muted)] mt-2">匹配 {filtered.length} 条</div>
        )}
      </section>

      <div className="space-y-2">
        {filtered.map((r) => (
          <details key={r.id} className="card" open={Boolean(kw)}>
            <summary className="cursor-pointer flex items-center gap-2">
              <span className="chip chip-brand font-mono shrink-0">{r.id}</span>
              <span className="font-medium flex-1">{r.text.slice(0, 40)}{r.text.length > 40 ? '…' : ''}</span>
            </summary>
            <div className="mt-2 text-sm leading-6 whitespace-pre-line">
              {kw ? highlight(r.text, kw) : r.text}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

function highlight(text: string, kw: string) {
  if (!kw) return text;
  const parts = text.split(new RegExp(`(${escapeReg(kw)})`, 'gi'));
  return parts.map((p, i) =>
    p.toLowerCase() === kw.toLowerCase() ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-700 px-0.5 rounded">{p}</mark> : p,
  );
}

function escapeReg(s: string) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }