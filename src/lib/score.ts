// 判分工具

import type { TheoryQuestion, QuestionType } from './types';

// 集合相等（顺序无关）
export function setEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((x, i) => x === sb[i]);
}

// 比较答题与答案
// 返回 'correct' | 'wrong' | 'partial'
export function judge(q: TheoryQuestion, picked: string[]): 'correct' | 'wrong' | 'partial' {
  const a = q.answer;
  if (q.type === 'multiple') {
    if (picked.length === a.length && setEqual(picked, a)) return 'correct';
    if (picked.some((p) => a.includes(p))) return 'partial';
    return 'wrong';
  }
  // single / judge
  if (picked.length !== 1) return 'wrong';
  return a[0] === picked[0] ? 'correct' : 'wrong';
}

// 计算考试总分
// 单选 / 判断：每题 1.5 分；多选：每题 2 分（部分对不给分）
// 与真实比例：60 题 = 60×1.5 = 90（理论）+ 多选部分对 10 = 100
export const SCORE: Record<QuestionType, number> = {
  single: 1.5,
  multiple: 2,
  judge: 1.5,
};

export function calcScore(items: { q: TheoryQuestion; picked: string[] }[]): {
  total: number;
  max: number;
  correctCount: number;
  byType: Record<QuestionType, { correct: number; total: number }>;
} {
  const byType: Record<QuestionType, { correct: number; total: number }> = {
    single: { correct: 0, total: 0 },
    multiple: { correct: 0, total: 0 },
    judge: { correct: 0, total: 0 },
  };
  let total = 0;
  let max = 0;
  let correctCount = 0;
  for (const { q, picked } of items) {
    max += SCORE[q.type];
    byType[q.type].total += 1;
    const r = judge(q, picked);
    if (r === 'correct') {
      total += SCORE[q.type];
      byType[q.type].correct += 1;
      correctCount += 1;
    } else if (r === 'partial' && q.type === 'multiple') {
      // 多选部分对：按 PRD，约定 0.5 倍分（最低 0）
      total += SCORE.multiple * 0.5;
    }
  }
  return { total, max, correctCount, byType };
}

export function formatPercent(n: number, d: number): string {
  if (d === 0) return '0%';
  return `${Math.round((n / d) * 100)}%`;
}