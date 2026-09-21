import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import PrintButton from '@/components/PrintButton';
import { cheatCards } from '@/data';

export default function CheatPage() {
  return (
    <div className="space-y-6">
      <section className="card no-print">
        <h1 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Sparkles size={20} className="text-[color:var(--brand)]" />
          速记卡片 · 高频易错 Top {cheatCards.length}
        </h1>
        <p className="text-sm text-[color:var(--fg-muted)]">
          临考 2 小时速记 —— 涵盖理论题最常错点 + 实操 7 段核心代码。
        </p>
        <div className="mt-3"><PrintButton /></div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cheatCards.map((c, i) => (
          <article key={c.id} className="card">
            <header className="flex items-start gap-2 mb-2">
              <span className="chip chip-brand font-mono shrink-0">#{i + 1}</span>
              <h2 className="font-semibold flex-1">{c.title}</h2>
            </header>
            <p className="text-sm leading-6 whitespace-pre-line">{c.body}</p>
            {c.tags && c.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {c.tags.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}