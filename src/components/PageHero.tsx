import type { ReactNode } from 'react';

interface PageHeroProps {
  icon: ReactNode;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  right?: ReactNode;
}

/**
 * 大型页面顶部 banner（央企首页气质）
 * 用于除首页以外的所有页面顶部
 */
export default function PageHero({ icon, eyebrow, title, subtitle, right }: PageHeroProps) {
  return (
    <section
      className="hero"
      style={{
        padding: '1.75rem 1.75rem',
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <span
            className="inline-flex items-center justify-center w-12 h-12 rounded-lg shrink-0"
            style={{
              background: 'rgba(255, 255, 255, .12)',
              border: '1px solid rgba(255, 255, 255, .22)',
            }}
          >
            {icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="hero-eyebrow" style={{ marginBottom: '.5rem' }}>{eyebrow}</div>
            <h1 className="hero-title" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)' }}>{title}</h1>
            {subtitle && <p className="hero-subtitle" style={{ marginTop: '.5rem' }}>{subtitle}</p>}
          </div>
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </section>
  );
}