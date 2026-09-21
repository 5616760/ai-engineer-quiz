// localStorage 封装（SSR 安全）

const PREFIX = 'ai-exam/v1';

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(`${PREFIX}:${key}`);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(`${PREFIX}:${key}`, JSON.stringify(value));
  } catch {
    /* quota exceeded, ignore */
  }
}

export function remove(key: string): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(`${PREFIX}:${key}`);
}

// 收藏：题目 id 集合
export function getFavorites(): Set<number> {
  return new Set(readJSON<number[]>('favorites', []));
}

export function setFavorites(set: Set<number>): void {
  writeJSON('favorites', [...set]);
}

export function toggleFavorite(id: number): boolean {
  const s = getFavorites();
  const added = !s.has(id);
  if (added) s.add(id); else s.delete(id);
  setFavorites(s);
  return added;
}

// 错题
export interface WrongRecord {
  id: number;
  count: number;        // 累计答错次数
  lastWrong: number;    // timestamp
}

export function getWrong(): Record<number, WrongRecord> {
  return readJSON<Record<number, WrongRecord>>('wrong', {});
}

export function recordWrong(id: number): void {
  const map = getWrong();
  if (map[id]) {
    map[id].count += 1;
    map[id].lastWrong = Date.now();
  } else {
    map[id] = { id, count: 1, lastWrong: Date.now() };
  }
  writeJSON('wrong', map);
}

export function clearWrong(id: number): void {
  const map = getWrong();
  delete map[id];
  writeJSON('wrong', map);
}

// 模拟成绩
export interface ExamRecord {
  ts: number;
  mode: 'theory' | 'practice';
  total: number;
  correct: number;
  durationSec: number;
  paperTitle?: string;
}

export function getExamHistory(): ExamRecord[] {
  return readJSON<ExamRecord[]>('exam-history', []);
}

export function appendExam(record: ExamRecord): void {
  const list = getExamHistory();
  list.unshift(record);
  writeJSON('exam-history', list.slice(0, 10)); // 仅保留最近 10 次
}

// 已答题进度
export function getAnswered(): Set<number> {
  return new Set(readJSON<number[]>('answered', []));
}

export function markAnswered(id: number): void {
  const s = getAnswered();
  s.add(id);
  writeJSON('answered', [...s]);
}

// 比赛日期覆盖（用户可在 settings 改）
export function getExamDateOverride(): string | null {
  return readJSON<string | null>('exam-date-override', null);
}

export function setExamDateOverride(iso: string | null): void {
  writeJSON('exam-date-override', iso);
}

// 全部导出
export function exportAll(): string {
  return JSON.stringify(
    {
      favorites: [...getFavorites()],
      wrong: getWrong(),
      history: getExamHistory(),
      answered: [...getAnswered()],
      examDateOverride: getExamDateOverride(),
    },
    null,
    2,
  );
}

export function importAll(json: string): boolean {
  try {
    const data = JSON.parse(json);
    if (data.favorites) writeJSON('favorites', data.favorites);
    if (data.wrong) writeJSON('wrong', data.wrong);
    if (data.history) writeJSON('exam-history', data.history);
    if (data.answered) writeJSON('answered', data.answered);
    if (data.examDateOverride !== undefined) writeJSON('exam-date-override', data.examDateOverride);
    return true;
  } catch {
    return false;
  }
}

export function resetAll(): void {
  ['favorites', 'wrong', 'exam-history', 'answered', 'exam-date-override'].forEach(remove);
}