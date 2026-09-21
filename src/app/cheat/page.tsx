import { Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import PrintButton from '@/components/PrintButton';
import { cheatCards } from '@/data';

export default function CheatPage() {
  return (
    <div className="space-y-6">
      <PageHero
        icon={<Sparkles size={24} className="text-white" strokeWidth={2.2} />}
        eyebrow="高频易错 · 临考速记"
        title={<>速记卡片 · Top {cheatCards.length}</>}
        subtitle={
          <>
            临考 2 小时速记 —— 涵盖理论题最常错点 + 实操 7 段核心代码。
            <br />
            支持<span style={{ color: '#fcd34d', fontWeight: 600 }}>打印</span>随身看。
          </>
        }
        right={<PrintButton />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {cheatCards.map((c, i) => (
          <article key={c.id} className="card card-elevated">
            <header className="flex items-start gap-2 mb-2">
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-mono"
                style={{
                  background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%)',
                  color: '#fff',
                }}
              >#{i + 1}</span>
              <h2 className="font-semibold flex-1 leading-snug">{c.title}</h2>
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