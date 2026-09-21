import Link from 'next/link';
import { Code2, BookOpen, ListChecks } from 'lucide-react';
import PrintButton from '@/components/PrintButton';
import { coding } from '@/data';

const fillPapers = coding.fillPapers;
const toolboxPapers = coding.toolboxPapers;

export default function CodingPage() {
  return (
    <div className="space-y-6">
      <section className="card">
        <h1 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Code2 size={20} className="text-[color:var(--brand)]" />
          代码题速查
        </h1>
        <p className="text-sm text-[color:var(--fg-muted)]">
          共 6 套样题：样题 1-3 为选段补全（4 选 1），样题 4-6 为工具箱选编号。本页提供<strong>答案速查表</strong>，临考 5 秒核对。
        </p>
      </section>

      {/* 样题 1-3：选段补全 */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <BookOpen size={18} className="text-[color:var(--brand)]" />
          选段补全（样题 1-3）
        </h2>
        <div className="space-y-3">
          {fillPapers.map((p: any) => (
            <div key={p.paper} className="card">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">样题 {p.paper}：{p.title}</div>
                <div className="text-xs text-[color:var(--fg-muted)]">{p.questions.length} 题</div>
              </div>
              {p.questions.length === 0 ? (
                <div className="text-sm text-[color:var(--fg-muted)]">
                  样题 {p.paper} 题库待补充（先放样题 1，剩余样题 2/3 请参照 <Link href="/cheat">速记卡</Link> 中的 PyTorch / NLP 套路）。
                </div>
              ) : (
                <details className="group">
                  <summary className="cursor-pointer text-sm text-[color:var(--brand)]">展开题目与答案</summary>
                  <div className="mt-3 space-y-4">
                    {p.questions.map((q: any) => (
                      <div key={q.id} className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                        <div className="text-xs text-[color:var(--fg-muted)] mb-1">第 {q.no} 题（{q.blanks === 2 ? '两空' : '单空'}）</div>
                        <pre className="code-block whitespace-pre-wrap mb-2 text-xs">{q.prompt}</pre>
                        <div className="text-sm">
                          <span className="chip chip-success">答案：{q.answer}</span>
                          <span className="ml-2 text-xs text-[color:var(--fg-muted)]">{q.explanation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 样题 4-6：工具箱选编号速查 */}
      <section>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <ListChecks size={18} className="text-[color:var(--brand)]" />
          工具箱选编号（样题 4-6）
        </h2>
        <div className="space-y-4">
          {toolboxPapers.map((p: any) => (
            <div key={p.paper} className="card">
              <div className="font-medium mb-1">样题 {p.paper}：{p.title}</div>
              <div className="text-xs text-[color:var(--fg-muted)] mb-3">{p.scenario}</div>

              <h3 className="text-sm font-semibold mb-2 text-[color:var(--brand)]">✅ 答案速查</h3>
              <table className="w-full text-sm border-collapse">
                <thead className="text-left text-xs text-[color:var(--fg-muted)] border-b" style={{ borderColor: 'var(--border)' }}>
                  <tr>
                    <th className="py-1.5 w-12">题号</th>
                    <th className="w-16">编号</th>
                    <th>正确代码</th>
                    <th>提示</th>
                  </tr>
                </thead>
                <tbody>
                  {p.answers.map((a: any) => (
                    <tr key={a.no} className="border-b" style={{ borderColor: 'var(--border)' }}>
                      <td className="py-2 font-mono">{a.no}</td>
                      <td><span className="chip chip-brand font-mono">{a.code}</span></td>
                      <td className="font-mono text-xs">{a.label}</td>
                      <td className="text-xs text-[color:var(--fg-muted)]">{a.hint}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-[color:var(--brand)]">展开工具箱</summary>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {p.toolbox.map((g: any) => (
                    <div key={g.id} className="border rounded p-2" style={{ borderColor: 'var(--border)' }}>
                      <div className="text-xs font-semibold mb-2">{g.title}</div>
                      <table className="w-full text-xs">
                        <tbody>
                          {g.items.map((it: any) => (
                            <tr key={it.code} className="border-t" style={{ borderColor: 'var(--border)' }}>
                              <td className="py-1 pr-2 font-mono w-12">{it.code}</td>
                              <td className="font-mono">{it.label}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      </section>

      <div className="no-print">
        <PrintButton label="打印所有代码题" />
      </div>
    </div>
  );
}