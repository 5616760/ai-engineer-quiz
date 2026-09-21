'use client';

import { useState } from 'react';
import { Download, Upload, RotateCcw, Save, Calendar } from 'lucide-react';
import { exportAll, importAll, resetAll, getExamDateOverride, setExamDateOverride } from '@/lib/storage';
import { contest } from '@/data';

export default function SettingsPage() {
  const [date, setDate] = useState(getExamDateOverride() || contest.examDate);
  const [saved, setSaved] = useState(false);
  const [importText, setImportText] = useState('');
  const [msg, setMsg] = useState('');

  function flash(m: string) {
    setMsg(m);
    setTimeout(() => setMsg(''), 3000);
  }

  function save() {
    setExamDateOverride(date);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    flash(`✅ 比赛日期已设为 ${date}`);
  }

  function doExport() {
    const json = exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-engineer-quiz-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function doImport() {
    if (importAll(importText)) {
      flash('✅ 导入成功，刷新后生效');
      setImportText('');
    } else {
      flash('❌ 格式错误，导入失败');
    }
  }

  function doReset() {
    if (typeof window !== 'undefined' && window.confirm('确认清空所有收藏 / 错题 / 模拟成绩？此操作不可恢复。')) {
      resetAll();
      flash('✅ 已重置所有进度');
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <section className="card">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Calendar size={18} className="text-[color:var(--brand)]" />
          比赛日期
        </h2>
        <p className="text-sm text-[color:var(--fg-muted)] mb-3">
          默认 {contest.examDate}，可在此覆盖（首页倒计时会更新）。
        </p>
        <div className="flex gap-2">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 px-3 py-2 rounded-md border bg-transparent" style={{ borderColor: 'var(--border)' }} />
          <button className="btn btn-primary" onClick={save}>
            <Save size={14} />
            {saved ? '已保存' : '保存'}
          </button>
        </div>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-3">进度管理</h2>
        <p className="text-sm text-[color:var(--fg-muted)] mb-3">
          收藏 / 错题 / 模拟成绩都存在 localStorage。换电脑前先导出，新设备导入即可恢复。
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          <button className="btn" onClick={doExport}><Download size={14} /> 导出 JSON</button>
          <button className="btn" onClick={doReset}><RotateCcw size={14} /> 重置全部</button>
        </div>

        <details className="mt-3">
          <summary className="cursor-pointer text-sm text-[color:var(--brand)]">从 JSON 恢复</summary>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder='粘贴之前导出的 JSON {"favorites":[...], ...}'
            className="w-full mt-2 p-2 text-xs font-mono rounded border bg-transparent"
            style={{ borderColor: 'var(--border)' }}
            rows={6}
          />
          <button className="btn btn-primary mt-2" onClick={doImport}><Upload size={14} /> 导入</button>
        </details>
      </section>

      <section className="card">
        <h2 className="text-lg font-semibold mb-3">关于</h2>
        <ul className="text-sm space-y-1 text-[color:var(--fg-muted)]">
          <li>📦 项目仓库：<a href="https://github.com/5616760/ai-engineer-quiz" target="_blank" rel="noreferrer">github.com/5616760/ai-engineer-quiz</a></li>
          <li>🛠 技术栈：Next.js 14 (App Router) + TypeScript + Tailwind</li>
          <li>📅 数据源自 2026 年北京市职工职业技能大赛公开题库</li>
          <li>📄 License: MIT</li>
        </ul>
      </section>

      {msg && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 card text-sm">{msg}</div>
      )}
    </div>
  );
}