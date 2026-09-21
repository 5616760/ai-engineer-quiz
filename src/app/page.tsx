import Link from 'next/link';
import { Brain, Code2, ClipboardCheck, Sparkles, ScrollText, MapPin, Clock, GraduationCap, BookOpen, Trophy, ArrowRight, FileWarning, Settings as SettingsIcon } from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import PrintButton from '@/components/PrintButton';
import { getExamDate, formatExamDate } from '@/lib/countdown';
import { theory, cheatCards, contest, coding } from '@/data';

export default function HomePage() {
  const target = getExamDate();
  const totalQ = theory.length;
  const cheatTop5 = cheatCards.slice(0, 5);
  const codingCount = coding.length;

  return (
    <div className="space-y-8">
      {/* ================== Hero 大块（深绿央企气质） ================== */}
      <section className="hero no-print">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="flex-1">
            <span className="hero-eyebrow">北京职工职业技能大赛 · 2026</span>
            <h1 className="hero-title">
              人工智能工程技术人员
              <br />
              <span style={{ color: '#fcd34d' }}>初赛备考中心</span>
            </h1>
            <p className="hero-subtitle">
              覆盖理论 300 题、实操 6 套样题、限时模拟考、14 条比赛须知。
              <br className="hidden sm:block" />
              一个站点，临场抱佛脚也够用。
            </p>
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="hero-chip"><MapPin size={14} /> {contest.location.split(' ').slice(0, 2).join(' ')}</span>
              <span className="hero-chip"><Clock size={14} /> {formatExamDate(target)} 开考</span>
              <span className="hero-chip hero-chip-warn">⚠ 纸笔 · 不带手机</span>
            </div>
          </div>

          {/* 大型倒计时 */}
          <div className="lg:w-[26rem] shrink-0">
            <div
              className="rounded-xl p-5"
              style={{
                background: 'rgba(255,255,255,.08)',
                border: '1px solid rgba(255,255,255,.18)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div className="text-center mb-3">
                <div className="text-xs uppercase tracking-[0.2em] text-teal-200/80 mb-1">距初赛开考</div>
                <CountdownTimer target={target} />
              </div>
              <div className="grid grid-cols-3 gap-2 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,.15)' }}>
                <Stat label="理论题" value={`${totalQ}`} suffix="题" />
                <Stat label="代码题" value={`${codingCount}`} suffix="套" />
                <Stat label="速记卡" value={`${cheatCards.length}`} suffix="张" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================== 4 大入口卡片 ================== */}
      <section>
        <div className="section-title">
          <h2>
            <span className="accent-bar" />
            备考入口
          </h2>
          <Link href="/rules" className="more">查看 14 条比赛须知 →</Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 no-print">
          <EntryCard href="/theory" icon={Sparkles} title="理论刷题" desc={`${totalQ} 题 · 单选/多选/判断`} hint="顺序·随机·错题·收藏" />
          <EntryCard href="/coding" icon={Code2} title="实操代码" desc={`${codingCount} 套样题`} hint="答案速查 + 工具箱" />
          <EntryCard href="/exam" icon={ClipboardCheck} title="模拟考" desc="理论 45min · 实操 90min" hint="限时自动判分" />
          <EntryCard href="/cheat" icon={ScrollText} title="速记卡" desc={`${cheatCards.length} 张高频易错点`} hint="可打印随身看" />
        </div>
      </section>

      {/* ================== 比赛信息（地点 + 时间表） ================== */}
      <section>
        <div className="section-title">
          <h2>
            <span className="accent-bar" />
            考场与安排
          </h2>
          <span className="text-xs text-[color:var(--fg-muted)]">{formatExamDate(target)} · 周四</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card card-elevated">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-[color:var(--brand)]" /> 考场信息
            </h3>
            <div className="info-list">
              <Row k="地点" v={contest.location} />
              <Row k="理论" v={contest.examTimeTheory} />
              <Row k="实操" v={contest.examTimePractice} />
              <Row k="形式" v={contest.format} />
              <Row k="入场" v={contest.earlyEntry} />
              <Row k="退场" v={contest.earlyLeave} />
              <Row k="证件" v={contest.idRequired} />
            </div>
          </div>

          <div className="card card-elevated">
            <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
              <Clock size={16} className="text-[color:var(--brand)]" /> 考场安排
            </h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[color:var(--fg-muted)]">
                  <th className="py-2 font-medium">场次</th>
                  <th className="font-medium">理论</th>
                  <th className="font-medium">实操</th>
                </tr>
              </thead>
              <tbody>
                {contest.schedule.map((s) => (
                  <tr key={s.team} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-2.5 font-medium">{s.team}</td>
                    <td className="font-mono">{s.theory}</td>
                    <td className="font-mono">{s.practice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 text-xs text-[color:var(--fg-muted)]">
              请提前 30 分钟到场，凭准考证 + 身份证入场
            </div>
          </div>
        </div>
      </section>

      {/* ================== Top 5 速记 ================== */}
      <section>
        <div className="section-title">
          <h2>
            <span className="accent-bar" />
            🔥 高频易错 Top 5
          </h2>
          <Link href="/cheat" className="more">查看全部 {cheatCards.length} 张速记 →</Link>
        </div>
        <div className="card card-elevated">
          <ol className="space-y-3">
            {cheatTop5.map((c, idx) => (
              <li key={c.id} className="flex gap-3">
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%)',
                    color: '#fff',
                  }}
                >
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-[color:var(--fg)] leading-snug">{c.title}</div>
                  <div className="text-sm text-[color:var(--fg-muted)] mt-1 leading-relaxed">{c.body.slice(0, 90)}{c.body.length > 90 ? '…' : ''}</div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ================== 工具快捷 ================== */}
      <section className="no-print">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickLink href="/rules" icon={FileWarning} label="比赛须知 14 条" />
          <QuickLink href="/settings" icon={SettingsIcon} label="设置 / 数据导入导出" />
          <QuickLink href="/theory?mode=wrong" icon={GraduationCap} label="错题本" />
          <QuickLink href="/theory?mode=favorite" icon={BookOpen} label="收藏题" />
        </div>
      </section>

      {/* ================== 底部激励 + 打印 ================== */}
      <section
        className="card no-print relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, color-mix(in srgb, var(--brand) 6%, var(--bg-card)) 0%, var(--bg-card) 100%)',
          borderColor: 'color-mix(in srgb, var(--brand) 25%, var(--border))',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Trophy size={36} className="text-[color:var(--warn)] shrink-0" />
          <div className="flex-1">
            <div className="font-bold text-lg">最后 3 天 · 把会做的先做对</div>
            <div className="text-sm text-[color:var(--fg-muted)] mt-1">把高频易错点背熟、把代码模板抄 3 遍、把模拟考做 2 次 —— 稳进复赛。</div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Link href="/exam" className="btn btn-primary btn-lg">
              开始模拟考 <ArrowRight size={16} />
            </Link>
            <PrintButton label="打印速记" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ----- 内部组件 ----- */
function Stat({ label, value, suffix }: { label: string; value: string; suffix?: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-white font-mono leading-none">
        {value}
        {suffix && <span className="text-xs text-teal-200/70 ml-1">{suffix}</span>}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-teal-200/70 mt-1">{label}</div>
    </div>
  );
}

function EntryCard({ href, icon: Icon, title, desc, hint }: { href: string; icon: any; title: string; desc: string; hint?: string }) {
  return (
    <Link href={href} className="entry-card">
      <ArrowRight size={16} className="arrow" />
      <span className="icon-wrap">
        <Icon size={22} />
      </span>
      <div className="title">{title}</div>
      <div className="desc">{desc}</div>
      {hint && <div className="text-xs text-[color:var(--fg-faint)] mt-auto pt-2 border-t" style={{ borderColor: 'var(--border)' }}>{hint}</div>}
    </Link>
  );
}

function QuickLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link href={href} className="card flex items-center gap-2 text-sm hover:border-[color:var(--brand-light)] transition-colors" style={{ color: 'inherit' }}>
      <Icon size={16} className="text-[color:var(--brand)] shrink-0" />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="row">
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  );
}