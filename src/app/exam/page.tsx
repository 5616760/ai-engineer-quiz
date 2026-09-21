'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { theory } from '@/data';
import type { TheoryQuestion } from '@/lib/types';
import { TYPE_LABEL, TOPIC_LABEL } from '@/lib/types';
import { pickN } from '@/lib/shuffle';
import { calcScore, formatPercent, judge } from '@/lib/score';
import { appendExam } from '@/lib/storage';

const MODES = {
  theory: { label: '理论模拟', minutes: 45, total: 60, desc: '按真实比例（单 53% / 多 22% / 判 25%）随机抽 60 题' },
  practice: { label: '实操速答', minutes: 90, total: 8, desc: '抽取 8 道代码相关理论题，限时 90 分钟练手感' },
};

export default function ExamPage() {
  const [mode, setMode] = useState<'theory' | 'practice'>('theory');
  const [phase, setPhase] = useState<'idle' | 'running' | 'finished'>('idle');
  const [questions, setQuestions] = useState<TheoryQuestion[]>([]);
  const [pickedMap, setPickedMap] = useState<Record<number, string[]>>({});
  const [idx, setIdx] = useState(0);
  const [deadline, setDeadline] = useState<number>(0);
  const [now, setNow] = useState<number>(0);

  function start() {
    const cfg = MODES[mode];
    const seed = Date.now() & 0xfffffff;
    let pool: TheoryQuestion[];
    if (mode === 'theory') {
      // 按真实比例 53/22/25
      const singles = pickN(theory.filter((q: any) => q.type === 'single'), Math.round(cfg.total * 0.53), seed);
      const multiples = pickN(theory.filter((q: any) => q.type === 'multiple'), Math.round(cfg.total * 0.22), seed + 1);
      const judges = pickN(theory.filter((q: any) => q.type === 'judge'), cfg.total - singles.length - multiples.length, seed + 2);
      pool = [...singles, ...multiples, ...judges];
    } else {
      pool = pickN(theory.filter((q: any) => q.topic === 'dl' || q.topic === 'cv' || q.topic === 'nlp'), cfg.total, seed);
    }
    setQuestions(pool);
    setPickedMap({});
    setIdx(0);
    setDeadline(Date.now() + cfg.minutes * 60 * 1000);
    setPhase('running');
  }

  // 倒计时
  useEffect(() => {
    if (phase !== 'running') return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= deadline) finish(true);
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, deadline]);

  function finish(timeout = false) {
    setPhase('finished');
    if (timeout) {
      // 自动交卷
    }
    appendExam({
      ts: Date.now(),
      mode,
      total: questions.length,
      correct: Object.entries(pickedMap).filter(([id, p]) => {
        const q = questions.find((q) => q.id === Number(id));
        return q ? judge(q, p) === 'correct' : false;
      }).length,
      durationSec: MODES[mode].minutes * 60 - Math.max(0, Math.floor((deadline - Date.now()) / 1000)),
    });
  }

  function onChange(picked: string[]) {
    const q = questions[idx];
    setPickedMap((m) => ({ ...m, [q.id]: picked }));
  }

  // 闲置阶段
  if (phase === 'idle') {
    return (
      <div className="space-y-4">
        <PageHero
          icon={<Clock size={24} className="text-white" strokeWidth={2.2} />}
          eyebrow="限时模拟考 · 2 种模式"
          title="模拟考试"
          subtitle="限时自测，超时自动交卷，自动判分 + 错题归档。"
          right={
            <span
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-mono"
              style={{
                background: 'rgba(255,255,255,.12)',
                border: '1px solid rgba(255,255,255,.22)',
                color: '#fff',
              }}
            >
              ⏱ 最多 90 min
            </span>
          }
        />
        <section className="card card-elevated">
          <h2 className="text-base font-semibold mb-4">选择模式</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(Object.keys(MODES) as ('theory' | 'practice')[]).map((k) => (
              <button
                key={k}
                className={`card text-left transition-all ${mode === k ? '!border-[color:var(--brand)] !border-2' : ''}`}
                style={mode === k ? { background: 'color-mix(in srgb, var(--brand) 6%, var(--bg-card))' } : undefined}
                onClick={() => setMode(k)}
              >
                <div className="font-semibold text-base mb-1">{MODES[k].label}</div>
                <div className="text-xs text-[color:var(--fg-muted)] mb-2 leading-relaxed">{MODES[k].desc}</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="chip chip-brand">{MODES[k].minutes} 分钟</span>
                  <span className="chip">{MODES[k].total} 题</span>
                </div>
              </button>
            ))}
          </div>
          <button className="btn btn-primary btn-lg mt-5 w-full justify-center" onClick={start}>开始考试 →</button>
        </section>
      </div>
    );
  }

  // 已交卷
  if (phase === 'finished') {
    const items = questions.map((q) => ({ q, picked: pickedMap[q.id] || [] }));
    const result = calcScore(items);
    const wrongList = items.filter(({ q, picked }) => picked.length > 0 && judge(q, picked) !== 'correct');

    return (
      <div className="space-y-4">
        <section className="card">
          <div className="flex items-center gap-2 mb-3 text-[color:var(--success)]">
            <CheckCircle2 size={20} />
            <h1 className="text-xl font-semibold">交卷完成</h1>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Stat label="总分" value={`${result.total.toFixed(1)} / ${result.max}`} />
            <Stat label="正确率" value={formatPercent(result.correctCount, result.total)} />
            <Stat label="用时" value={`${Math.ceil((Date.now() - (deadline - MODES[mode].minutes * 60 * 1000)) / 60000)} 分钟`} />
            <Stat label="错题" value={`${wrongList.length} 题`} />
          </div>

          <h3 className="text-sm font-semibold mb-2">题型分布</h3>
          <table className="w-full text-sm mb-4">
            <tbody>
              {(Object.keys(result.byType) as Array<keyof typeof result.byType>).map((t) => (
                <tr key={t} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-2 w-24">{TYPE_LABEL[t as keyof typeof TYPE_LABEL]}</td>
                  <td className="font-mono">{result.byType[t].correct} / {result.byType[t].total}</td>
                  <td className="text-[color:var(--fg-muted)]">{formatPercent(result.byType[t].correct, result.byType[t].total)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-2 no-print">
            <button className="btn" onClick={() => setPhase('idle')}>返回</button>
            <button className="btn btn-primary" onClick={start}>再来一次</button>
            <Link href="/theory?mode=wrong" className="btn">去看错题</Link>
          </div>
        </section>

        {wrongList.length > 0 && (
          <section className="card">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle size={16} className="text-[color:var(--error)]" />
              错题一览（{wrongList.length}）
            </h3>
            <ol className="space-y-2 list-decimal list-inside text-sm">
              {wrongList.slice(0, 12).map(({ q, picked }) => (
                <li key={q.id}>
                  <Link href={`/theory?topic=${q.topic}&type=${q.type}`}>
                    <span className="font-medium">#{q.id} · {TOPIC_LABEL[q.topic]}</span>
                  </Link>
                  <span className="ml-2 text-[color:var(--fg-muted)]">你的答：{picked.join('、') || '未答'}｜正确：{q.answer.join('、')}</span>
                </li>
              ))}
            </ol>
            {wrongList.length > 12 && (
              <div className="text-xs text-[color:var(--fg-muted)] mt-2">… 还有 {wrongList.length - 12} 题已加入错题本</div>
            )}
          </section>
        )}
      </div>
    );
  }

  // 答题中
  const q = questions[idx];
  const remaining = Math.max(0, deadline - now);
  const mm = Math.floor(remaining / 60000);
  const ss = Math.floor((remaining % 60000) / 1000);
  const lowTime = remaining < 5 * 60 * 1000;

  return (
    <div className="space-y-4">
      {/* 顶栏：倒计时 + 进度 */}
      <div className={`card sticky top-14 z-40 ${lowTime ? 'border-[color:var(--error)] border-2' : ''}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Clock size={16} className={lowTime ? 'text-[color:var(--error)]' : 'text-[color:var(--brand)]'} />
            <span className="font-mono text-lg tabular-nums" style={{ color: lowTime ? 'var(--error)' : undefined }}>
              {String(mm).padStart(2, '0')}:{String(ss).padStart(2, '0')}
            </span>
            {lowTime && <span className="chip chip-error">⚠️ 剩余不足 5 分钟</span>}
          </div>
          <div className="text-sm">
            第 <strong>{idx + 1}</strong> / {questions.length} 题
            <span className="text-[color:var(--fg-muted)] ml-2">已答 {Object.keys(pickedMap).length}</span>
          </div>
          <button className="btn btn-primary" onClick={() => finish()}>交卷</button>
        </div>
        <div className="mt-2 h-1.5 rounded bg-[color:var(--bg-muted)] overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${((MODES[mode].minutes * 60 * 1000 - remaining) / (MODES[mode].minutes * 60 * 1000)) * 100}%`,
              background: lowTime ? 'var(--error)' : 'var(--brand)',
            }}
          />
        </div>
      </div>

      {/* 当前题 */}
      <div className="card max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="chip chip-brand">{TYPE_LABEL[q.type]}</span>
          <span className="chip">{TOPIC_LABEL[q.topic]}</span>
          <span className="text-xs text-[color:var(--fg-muted)]">#{q.id}</span>
        </div>
        <div className="text-base leading-7 mb-4 whitespace-pre-line">{q.stem}</div>

        {q.type === 'judge' ? (
          <div className="grid grid-cols-2 gap-2">
            {['正确', '错误'].map((opt) => {
              const picked = (pickedMap[q.id] || []).includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => onChange([opt])}
                  className={`choice rounded-md py-3 text-center font-medium ${picked ? 'selected' : ''}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {(q.options || []).map((opt) => {
              const picked = (pickedMap[q.id] || []).includes(opt.key);
              return (
                <button
                  key={opt.key}
                  onClick={() => {
                    if (q.type === 'multiple') {
                      const cur = pickedMap[q.id] || [];
                      onChange(cur.includes(opt.key) ? cur.filter((k) => k !== opt.key) : [...cur, opt.key]);
                    } else {
                      onChange([opt.key]);
                    }
                  }}
                  className={`choice w-full text-left rounded-md px-4 py-3 flex gap-3 ${picked ? 'selected' : ''}`}
                >
                  <span className="font-mono font-semibold shrink-0">{opt.key}.</span>
                  <span className="flex-1">{opt.text}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <button className="btn" onClick={() => setIdx(Math.max(0, idx - 1))} disabled={idx === 0}>
            <ChevronLeft size={14} /> 上一题
          </button>
          <button className="btn" onClick={() => setIdx(Math.min(questions.length - 1, idx + 1))} disabled={idx === questions.length - 1}>
            下一题 <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 答题卡 */}
      <div className="card">
        <div className="text-sm font-medium mb-2">答题卡</div>
        <div className="flex flex-wrap gap-1.5">
          {questions.map((q, i) => {
            const answered = pickedMap[q.id] !== undefined;
            const isCur = i === idx;
            return (
              <button
                key={q.id}
                onClick={() => setIdx(i)}
                className={`w-9 h-9 text-xs rounded font-mono ${isCur ? 'btn-primary' : answered ? 'chip-brand' : 'btn'}`}
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-[color:var(--brand)]">{value}</div>
      <div className="text-xs text-[color:var(--fg-muted)] mt-1">{label}</div>
    </div>
  );
}