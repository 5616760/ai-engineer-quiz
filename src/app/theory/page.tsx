import { Suspense } from 'react';
import { Sparkles } from 'lucide-react';
import PageHero from '@/components/PageHero';
import TheoryInner from './TheoryInner';

// 静态导出要求：移除 force-dynamic，让 Next.js 自动判断。
// useSearchParams 已在 TheoryInner（client component）+ Suspense 内安全使用。
// 同时加 dynamic = 'force-static' 显式声明，避免 Next.js 在客户端组件包裹 Suspense 时仍标 force-dynamic。
export const dynamic = 'force-static';

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