'use client';

import { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck, Flag, FlagOff, ChevronLeft, ChevronRight } from 'lucide-react';
import type { TheoryQuestion } from '@/lib/types';
import { TOPIC_LABEL, TYPE_LABEL } from '@/lib/types';
import {
  getFavorites,
  toggleFavorite,
  getWrong,
  recordWrong,
  clearWrong,
  markAnswered,
} from '@/lib/storage';
import { judge } from '@/lib/score';

interface Props {
  q: TheoryQuestion;
  index: number;          // 当前题序号（从 0 开始）
  total: number;
  picked: string[];
  onChange: (picked: string[]) => void;
  onPrev?: () => void;
  onNext?: () => void;
  onJump?: (n: number) => void;  // 跳号
}

export default function QuestionCard({ q, index, total, picked, onChange, onPrev, onNext }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [fav, setFav] = useState(false);
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    setSubmitted(false);
    setFav(getFavorites().has(q.id));
    setFlagged(Boolean(getWrong()[q.id]));
  }, [q.id]);

  function togglePick(key: string) {
    if (submitted) return;
    if (q.type === 'multiple') {
      onChange(picked.includes(key) ? picked.filter((k) => k !== key) : [...picked, key]);
    } else {
      onChange([key]);
    }
  }

  function submit() {
    setSubmitted(true);
    markAnswered(q.id);
    const r = judge(q, picked);
    if (r !== 'correct') recordWrong(q.id);
    else clearWrong(q.id);
  }

  function reset() {
    setSubmitted(false);
    onChange([]);
  }

  function onFav() {
    const added = toggleFavorite(q.id);
    setFav(added);
  }

  function onFlag() {
    setFlagged(!flagged);
    if (flagged) clearWrong(q.id);
    else recordWrong(q.id);
  }

  const result = submitted ? judge(q, picked) : null;
  const isMulti = q.type === 'multiple';

  return (
    <div className="card max-w-4xl mx-auto">
      {/* 顶部条 */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="chip chip-brand">{TYPE_LABEL[q.type]}</span>
          <span className="chip">{TOPIC_LABEL[q.topic]}</span>
          <span className="text-xs text-[color:var(--fg-muted)]">第 {index + 1} / {total} 题 · 原题号 #{q.id}</span>
        </div>
        <div className="flex items-center gap-1 no-print">
          <button className="btn btn-ghost p-2" onClick={onFav} title={fav ? '取消收藏' : '收藏'} aria-label="收藏">
            {fav ? <BookmarkCheck size={16} className="text-[color:var(--warn)]" /> : <Bookmark size={16} />}
          </button>
          <button className="btn btn-ghost p-2" onClick={onFlag} title={flagged ? '移除错题标记' : '加入错题本'} aria-label="错题标记">
            {flagged ? <Flag size={16} className="text-[color:var(--error)]" /> : <FlagOff size={16} />}
          </button>
        </div>
      </div>

      {/* 题干 */}
      <div className="text-base leading-7 mb-4 whitespace-pre-line">{q.stem}</div>

      {/* 选项 */}
      {q.type === 'judge' ? (
        <div className="grid grid-cols-2 gap-2">
          {['正确', '错误'].map((opt) => {
            const isPicked = picked[0] === opt;
            const isAnswer = q.answer.includes(opt);
            const cls = submitted
              ? isAnswer
                ? 'correct'
                : isPicked
                  ? 'wrong'
                  : 'unselected'
              : isPicked ? 'selected' : '';
            return (
              <button
                key={opt}
                onClick={() => togglePick(opt)}
                className={`choice rounded-md py-3 text-center text-base font-medium ${cls}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {(q.options || []).map((opt) => {
            const isPicked = picked.includes(opt.key);
            const isAnswer = q.answer.includes(opt.key);
            let cls = '';
            if (submitted) {
              if (isAnswer && isPicked) cls = 'correct';
              else if (isAnswer && !isPicked && isMulti) cls = 'missed';
              else if (!isAnswer && isPicked) cls = 'wrong';
              else cls = 'unselected';
            } else if (isPicked) cls = 'selected';
            return (
              <button
                key={opt.key}
                onClick={() => togglePick(opt.key)}
                className={`choice w-full text-left rounded-md px-4 py-3 flex gap-3 ${cls}`}
              >
                <span className="font-mono font-semibold shrink-0">{opt.key}.</span>
                <span className="flex-1">{opt.text}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 提交按钮 / 反馈 */}
      {!submitted ? (
        <div className="mt-5 flex items-center gap-2 no-print">
          <button className="btn btn-primary" onClick={submit} disabled={picked.length === 0}>
            提交
          </button>
          <button className="btn" onClick={reset} disabled={picked.length === 0}>
            清空
          </button>
        </div>
      ) : (
        <div className="mt-5 no-print">
          <div className={`p-3 rounded-md border ${result === 'correct' ? 'chip-success' : result === 'partial' ? 'chip-warn' : 'chip-error'}`} style={{ background: result === 'correct' ? 'color-mix(in srgb, var(--success) 8%, transparent)' : result === 'partial' ? 'color-mix(in srgb, var(--partial) 8%, transparent)' : 'color-mix(in srgb, var(--error) 8%, transparent)' }}>
            <div className="font-medium mb-1">
              {result === 'correct' ? '✅ 正确' : result === 'partial' ? '⚠️ 部分正确（多选漏选）' : '❌ 错误'}
              <span className="ml-2 text-sm font-normal text-[color:var(--fg-muted)]">正确答案：{q.answer.join('、')}</span>
            </div>
            <div className="text-sm leading-6 whitespace-pre-line">{q.explanation}</div>
          </div>
        </div>
      )}

      {/* 底部导航 */}
      <div className="mt-5 flex items-center justify-between no-print">
        <button className="btn" onClick={onPrev} disabled={!onPrev}>
          <ChevronLeft size={14} /> 上一题
        </button>
        <span className="text-xs text-[color:var(--fg-muted)]">
          ← / → 切换  ·  1-{total} 跳号
        </span>
        <button className="btn" onClick={onNext} disabled={!onNext}>
          下一题 <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}