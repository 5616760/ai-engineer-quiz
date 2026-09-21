// 把 theory.raw.json 转为最终 theory.json
import fs from 'node:fs';

const SRC = 'g:/DATA/Work/2026/21AI大赛/code/src/data/theory.raw.json';
const OUT = 'g:/DATA/Work/2026/21AI大赛/code/src/data/theory.json';

const raw = JSON.parse(fs.readFileSync(SRC, 'utf8'));

// 主题分布映射（人工核对过）
const topicRanges = [
  // 单选
  { type: 'single', start: 1,   end: 37,  topic: 'ethics' },
  { type: 'single', start: 38,  end: 65,  topic: 'ml' },
  { type: 'single', start: 66,  end: 98,  topic: 'cv' },
  { type: 'single', start: 99,  end: 122, topic: 'nlp' },
  { type: 'single', start: 123, end: 159, topic: 'dl' },
  // 多选
  { type: 'multiple', start: 160, end: 173, topic: 'ethics' },
  { type: 'multiple', start: 174, end: 187, topic: 'ml' },
  { type: 'multiple', start: 188, end: 197, topic: 'cv' },
  { type: 'multiple', start: 198, end: 206, topic: 'nlp' },
  { type: 'multiple', start: 207, end: 225, topic: 'dl' },
  // 判断
  { type: 'judge', start: 226, end: 244, topic: 'ethics' },
  { type: 'judge', start: 245, end: 258, topic: 'ml' },
  { type: 'judge', start: 259, end: 267, topic: 'cv' },
  { type: 'judge', start: 268, end: 281, topic: 'nlp' },
  { type: 'judge', start: 282, end: 300, topic: 'dl' },
];

function getTopic(type, id) {
  const r = topicRanges.find(x => x.type === type && id >= x.start && id <= x.end);
  return r ? r.topic : 'tooling';
}

function parseAnswer(ansLine) {
  // 形如：答案：B。 / 答案：ACD。 / 答案：正确。 / 答案：错误。
  if (!ansLine) return [];
  const m = ansLine.match(/答案：(.+?)。?$/);
  if (!m) return [];
  let s = m[1].trim();
  if (s === '正确' || s === '对' || s === '√') return ['正确'];
  if (s === '错误' || s === '错' || s === '×') return ['错误'];
  // 多选/单选字母
  const letters = s.split('').filter(c => /[A-Z]/.test(c));
  return letters;
}

function parseQuestion(raw) {
  // raw 中含有题干+选项+答案。清理"-- xx of yy --"页脚。
  const cleaned = raw.replace(/--\s*\d+\s*of\s*\d+\s*--/g, '').trim();

  // 选项：以"A."或"A．"开始
  const optionRe = /([A-D])[\.．、]\s*/g;
  const matches = [];
  let m;
  while ((m = optionRe.exec(cleaned)) !== null) {
    matches.push({ key: m[1], start: m.index });
  }

  // 提取 stem
  let stemEnd = matches.length > 0 ? matches[0].start : cleaned.length;
  const stem = cleaned.slice(0, stemEnd).trim();

  // 提取选项
  const options = [];
  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const next = matches[i + 1];
    const text = cleaned.slice(cur.start + 2, next ? next.start : cleaned.length).trim();
    // 去除选项 key 和前导符号
    const cleanText = text.replace(/^[\.．、\s]+/, '');
    options.push({ key: cur.key, text: cleanText });
  }

  return { stem, options };
}

const out = [];
for (const q of raw) {
  const { stem, options } = parseQuestion(q.raw);
  const answer = parseAnswer(q.answer);
  const topic = getTopic(q.type, q.id);

  out.push({
    id: q.id,
    type: q.type,
    topic,
    stem,
    options,
    answer,
    // 初始版本 explanation 留空，后续可以批量补
    explanation: '',
    keywords: [],
  });
}

// 统计
const dist = {};
for (const q of out) {
  const k = `${q.type}/${q.topic}`;
  dist[k] = (dist[k] || 0) + 1;
}
console.log('最终分布:', dist);

fs.writeFileSync(OUT, JSON.stringify(out, null, 0), 'utf8');
console.log('已写入:', OUT, '字节:', fs.statSync(OUT).size);