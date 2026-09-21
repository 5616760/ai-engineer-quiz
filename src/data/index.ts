// 数据集中导出 —— 绕过 Next.js 对 JSON 命名导入的限制

import _contest from './contest.json';
import _theory from './theory.json';
import _cheat from './cheat.json';
import _coding from './coding.json';

import type { TheoryQuestion, CheatCard } from '@/lib/types';

// 顶层已是 ContestInfo 兼容结构，直接导出
export const contest = _contest as any as import('@/lib/types').ContestInfo;
export const theory = (_theory as { theory: TheoryQuestion[] }).theory;
export const cheatCards = (_cheat as { cheatCards: CheatCard[] }).cheatCards;
export const coding = _coding as any;