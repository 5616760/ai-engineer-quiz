import { Suspense } from 'react';
import TheoryInner from './TheoryInner';

export const dynamic = 'force-dynamic';

export default function TheoryPage() {
  return (
    <Suspense fallback={<div className="card text-center text-[color:var(--fg-muted)] py-12">加载题库中...</div>}>
      <TheoryInner />
    </Suspense>
  );
}