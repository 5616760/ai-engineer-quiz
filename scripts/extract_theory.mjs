// 从 pdf_content.txt 中提取理论题
import fs from 'node:fs';

const SRC = 'g:/DATA/Work/2026/21AI大赛/zl/pdf_content.txt';
const OUT = 'g:/DATA/Work/2026/21AI大赛/code/src/data/theory.raw.json';

const text = fs.readFileSync(SRC, 'utf8');

// 理论题库在最后一个 FILE 区块
const startIdx = text.indexOf('FILE: 理论题库.pdf');
if (startIdx < 0) { console.error('未找到理论题库'); process.exit(1); }
const restAfter = text.indexOf('FILE:', startIdx + 10);
const endIdx = restAfter > -1 ? restAfter : text.length;
const block = text.slice(startIdx, endIdx);
console.log('理论题库区块字符数:', block.length);

// 题型分割点
const typeMarkers = ['单选', '多选', '判断'];
const idxs = typeMarkers.map(t => block.indexOf(`\n${t}\n`));
console.log('题型位置:', idxs);

const sections = [];
if (idxs[0] > -1 && idxs[1] > -1) sections.push({ type: 'single', text: block.slice(idxs[0] + 1, idxs[1]) });
if (idxs[1] > -1 && idxs[2] > -1) sections.push({ type: 'multiple', text: block.slice(idxs[1] + 1, idxs[2]) });
if (idxs[2] > -1) sections.push({ type: 'judge', text: block.slice(idxs[2] + 1) });

// 每种题型解析
const out = [];
for (const sec of sections) {
  if (!sec.text) continue;
  const lines = sec.text.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m3 = line.match(/^(\d+)、(.*)$/);
    if (m3) {
      const id = parseInt(m3[1]);
      const startStem = m3[2];
      let j = i + 1;
      let chunk = startStem;
      while (j < lines.length && !/^答案：/.test(lines[j])) {
        chunk += '\n' + lines[j];
        j++;
      }
      let answerLine = '';
      if (j < lines.length) {
        answerLine = lines[j];
        j++;
      }
      out.push({ type: sec.type, id, raw: chunk, answer: answerLine });
      i = j;
    } else {
      i++;
    }
  }
}

console.log('提取题目数:', out.length, '分布:', out.reduce((acc, x) => { acc[x.type] = (acc[x.type] || 0) + 1; return acc; }, {}));

fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf8');
console.log('已写入:', OUT);