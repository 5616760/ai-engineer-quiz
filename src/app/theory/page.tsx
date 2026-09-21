import { Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import PageHero from '@/components/PageHero';
import TheoryInner from './TheoryInner';

export const dynamic = 'force-dynamic';

export default function TheoryPage() {
  return (
    <>
      <PageHero
        icon={<Sparkles size={24} className="text-white" strokeWidth={2.2} />}
        eyebrow="理论刷题 · 300 题"
        title="理论题刷题中心"
        subtitle="单选 159 / 多选 66 / 判断 75，6 大知识点，支持顺序·随机·错题·收藏四模式，键盘快捷键 ← / → / 1-9。"
        right={
          <span
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-mono"
            style={{
              background: 'rgba(255,255,255,.12)',
              border: '1px solid rgba(255,255,255,.22)',
              color: '#fff',
            }}
          >
            300 题
          </span>
        }
      />
      <div className="mt-6">
        <Suspense fallback={<div className="card text-center text-[color:var(--fg-muted)] py-12">加载题库中...</div>}>
          <TheoryInner />
        </Suspense>
      </div>
    </>
  );
}