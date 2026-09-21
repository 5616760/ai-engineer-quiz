import Link from 'next/link';
import { Brain, Code2, ClipboardCheck, Sparkles, ScrollText, MapPin, Clock } from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import PrintButton from '@/components/PrintButton';
import { getExamDate, formatExamDate } from '@/lib/countdown';
import { theory, cheatCards, contest } from '@/data';

export default function HomePage() {
  const target = getExamDate();
  const totalQ = theory.length;
  const cheatTop5 = cheatCards.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="card no-print">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="text-xs text-[color:var(--fg-muted)] uppercase tracking-wider mb-2">北京职工职业技能大赛 · 2026</div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">人工智能工程技术人员竞赛 · 初赛备考</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="chip chip-brand"><Clock size={12} /> {formatExamDate(target)} 开考</span>
              <span className="chip"><MapPin size={12} /> {contest.location.split(' ')[0]} {contest.location.split(' ')[1]}</span>
              <span className="chip chip-warn">纸笔 · 不带手机</span>
            </div>
          </div>
          <div className="text-center md:text-right">
            <div className="text-xs text-[color:var(--fg-muted)] mb-2">距初赛还有</div>
            <CountdownTimer target={target} />
          </div>
        </div>
      </section>

      {/* 4 个入口 */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 no-print">
        <EntryLink href="/theory" icon={Sparkles} title="理论刷题" desc={`${totalQ} 题`} />
        <EntryLink href="/coding" icon={Code2} title="实操代码" desc="6 套样题" />
        <EntryLink href="/exam" icon={ClipboardCheck} title="模拟考试" desc="限时自测" />
        <EntryLink href="/cheat" icon={ScrollText} title="速记卡片" desc="高频易错" />
      </section>

      {/* 比赛须知摘要 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MapPin size={16} className="text-[color:var(--brand)]" />
            考场信息
          </h2>
          <dl className="text-sm space-y-2">
            <Row k="地点" v={contest.location} />
            <Row k="理论时间" v={contest.examTimeTheory} />
            <Row k="实操时间" v={contest.examTimePractice} />
            <Row k="形式" v={contest.format} />
            <Row k="入场" v={contest.earlyEntry} />
            <Row k="退场" v={contest.earlyLeave} />
            <Row k="证件" v={contest.idRequired} />
          </dl>
          <Link href="/rules" className="text-sm mt-3 inline-block">查看全部 14 条须知 →</Link>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Clock size={16} className="text-[color:var(--brand)]" />
            考场安排
          </h2>
          <table className="w-full text-sm">
            <thead className="text-left text-[color:var(--fg-muted)]">
              <tr>
                <th className="py-1">场次</th>
                <th>理论</th>
                <th>实操</th>
              </tr>
            </thead>
            <tbody>
              {contest.schedule.map((s) => (
                <tr key={s.team} className="border-t" style={{ borderColor: 'var(--border)' }}>
                  <td className="py-2 font-medium">{s.team}</td>
                  <td>{s.theory}</td>
                  <td>{s.practice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top 5 速记 */}
      <section className="card">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          🔥 高频易错 Top 5
        </h2>
        <ol className="space-y-2 list-decimal list-inside">
          {cheatTop5.map((c) => (
            <li key={c.id} className="text-sm leading-6">
              <span className="font-medium">{c.title}</span>
              <span className="text-[color:var(--fg-muted)]"> — {c.body.slice(0, 60)}{c.body.length > 60 ? '…' : ''}</span>
            </li>
          ))}
        </ol>
        <Link href="/cheat" className="text-sm mt-3 inline-block">查看全部 {cheatCards.length} 张速记卡 →</Link>
      </section>

      <div className="no-print">
        <PrintButton label="打印首页" />
      </div>
    </div>
  );
}

function EntryLink({ href, icon: Icon, title, desc }: { href: string; icon: any; title: string; desc: string }) {
  return (
    <Link href={href} className="card hover:shadow-lg transition-shadow flex flex-col items-start gap-2 no-underline" style={{ color: 'inherit' }}>
      <Icon size={20} className="text-[color:var(--brand)]" />
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-[color:var(--fg-muted)]">{desc}</div>
      </div>
    </Link>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-[color:var(--fg-muted)] shrink-0 w-20">{k}</dt>
      <dd className="flex-1">{v}</dd>
    </div>
  );
}