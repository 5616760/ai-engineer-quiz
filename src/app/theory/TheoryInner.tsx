'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Shuffle, ListOrdered, Filter } from 'lucide-react';
import QuestionCard from '@/components/QuestionCard';
import PrintButton from '@/components/PrintButton';
import { theory } from '@/data';
import { TOPIC_LABEL, TYPE_LABEL } from '@/lib/types';
import type { Topic, QuestionType, TheoryQuestion } from '@/lib/types';
import { shuffle, pickN } from '@/lib/shuffle';

const TOPICS: (Topic | 'all')[] = ['all', 'ethics', 'ml', 'cv', 'nlp', 'dl', 'tooling'];
const TYPES: (QuestionType | 'all')[] = ['all', 'single', 'multiple', 'judge'];

export default function TheoryInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const topic = (sp.get('topic') || 'all') as Topic | 'all';
  const type = (sp.get('type') || 'all') as QuestionType | 'all';
  const mode = (sp.get('mode') || 'sequential') as 'sequential' | 'random' | 'wrong' | 'favorite';
  const n = Math.max(1, Math.min(300, parseInt(sp.get('n') || '0', 10)));

  const list = useMemo(() => {
    let pool = theory.slice() as TheoryQuestion[];
    if (topic !== 'all') pool = pool.filter((q) => q.topic === topic);
    if (type !== 'all') pool = pool.filter((q) => q.type === type);
    if (mode === 'random') pool = pickN(pool, n > 0 ? n : 20, Date.now() & 0xffff);
    else if (mode === 'wrong') pool = pool.filter((q) => Boolean((typeof window !== 'undefined' && JSON.parse(localStorage.getItem('ai-exam/v1:wrong') || '{}')[q.id])));
    else if (mode === 'favorite') pool = pool.filter((q) => (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('ai-exam/v1:favorites') || '[]')).includes(q.id));
    else pool = shuffle(pool, 1);
    return pool;
  }, [topic, type, mode, n]);

  const [pickedMap, setPickedMap] = useState<Record<number, string[]>>({});
  const [idx, setIdx] = useState(0);

  useEffect(() => { setIdx(0); }, [topic, type, mode]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowLeft') setIdx((i) => Math.max(0, i - 1));
      else if (e.key === 'ArrowRight') setIdx((i) => Math.min(list.length - 1, i + 1));
      else if (/^[1-9]$/.test(e.key)) {
        const target = parseInt(e.key, 10) - 1;
        if (target < list.length) setIdx(target);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [list.length]);

  function setParam(name: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value === '' || value === 'all') params.delete(name); else params.set(name, value);
    router.replace(`/theory?${params.toString()}`);
  }

  const current = list[idx];

  return (
    <div className="space-y-4">
      {/* 筛选栏 */}
      <div className="card no-print">
        <div className="flex flex-wrap items-center gap-3">
          <Filter size={16} className="text-[color:var(--fg-muted)]" />
          <Select label="知识点" value={topic} onChange={(v) => setParam('topic', v)} options={TOPICS.map((t) => ({ value: t, label: t === 'all' ? '全部' : TOPIC_LABEL[t as Topic] }))} />
          <Select label="题型" value={type} onChange={(v) => setParam('type', v)} options={TYPES.map((t) => ({ value: t, label: t === 'all' ? '全部' : TYPE_LABEL[t as QuestionType] }))} />
          <div className="flex items-center gap-1 ml-2">
            <button className={`btn ${mode === 'sequential' ? 'btn-primary' : ''}`} onClick={() => setParam('mode', 'sequential')}>
              <ListOrdered size={14} /> 顺序
            </button>
            <button className={`btn ${mode === 'random' ? 'btn-primary' : ''}`} onClick={() => setParam('mode', 'random')}>
              <Shuffle size={14} /> 随机
            </button>
            <button className={`btn ${mode === 'wrong' ? 'btn-primary' : ''}`} onClick={() => setParam('mode', 'wrong')}>
              🚩 错题
            </button>
            <button className={`btn ${mode === 'favorite' ? 'btn-primary' : ''}`} onClick={() => setParam('mode', 'favorite')}>
              ⭐ 收藏
            </button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {mode === 'random' && (
              <label className="text-xs flex items-center gap-1">
                抽 <input type="number" min={1} max={list.length} value={n || 20} onChange={(e) => setParam('n', e.target.value)} className="w-14 px-2 py-1 rounded border bg-transparent" style={{ borderColor: 'var(--border)' }} /> 题
              </label>
            )}
            <PrintButton />
          </div>
        </div>
        <div className="text-xs text-[color:var(--fg-muted)] mt-2">
          共 {list.length} 题 · 当前第 {Math.min(idx + 1, list.length)} 题
        </div>
      </div>

      {/* 主区 */}
      {list.length === 0 ? (
        <div className="card text-center text-[color:var(--fg-muted)] py-12">
          当前条件下没有题目。
        </div>
      ) : current ? (
        <QuestionCard
          q={current}
          index={idx}
          total={list.length}
          picked={pickedMap[current.id] || []}
          onChange={(p) => setPickedMap((m) => ({ ...m, [current.id]: p }))}
          onPrev={idx > 0 ? () => setIdx(idx - 1) : undefined}
          onNext={idx < list.length - 1 ? () => setIdx(idx + 1) : undefined}
        />
      ) : null}

      {/* 答题卡 */}
      <div className="card no-print">
        <div className="text-sm font-medium mb-2">答题卡</div>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
          {list.map((q, i) => {
            const answered = pickedMap[q.id] !== undefined;
            const isCur = i === idx;
            return (
              <button
                key={q.id}
                onClick={() => setIdx(i)}
                className={`w-9 h-9 text-xs rounded font-mono ${isCur ? 'btn-primary' : answered ? 'chip-brand' : 'btn'}`}
                title={`#${q.id} ${TYPE_LABEL[q.type]} · ${TOPIC_LABEL[q.topic]}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <label className="flex items-center gap-1 text-xs">
      <span className="text-[color:var(--fg-muted)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 rounded border bg-transparent"
        style={{ borderColor: 'var(--border)' }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}