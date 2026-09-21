// 确定性洗牌（Fisher–Yates with seed）
// 给定相同 seed，结果一致 —— 满足 PRD §4.1 "乱序模式" 需求

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  const rand = mulberry32(seed);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// 题号按 seed 取若干
export function pickN<T>(arr: T[], n: number, seed: number): T[] {
  return shuffle(arr, seed).slice(0, Math.min(n, arr.length));
}