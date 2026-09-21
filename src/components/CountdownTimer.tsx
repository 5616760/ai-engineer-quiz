'use client';

import { useEffect, useState } from 'react';

interface Props {
  target: Date;
  onExpire?: () => void;
  compact?: boolean;
}

export default function CountdownTimer({ target, onExpire, compact }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!now) return;
    if (target.getTime() - now.getTime() <= 0 && onExpire) onExpire();
  }, [now, target, onExpire]);

  if (!now) return <span className="font-mono">--</span>;

  const ms = target.getTime() - now.getTime();
  if (ms <= 0) return <span className="font-mono text-[color:var(--error)]">已开考</span>;

  const totalSec = Math.floor(ms / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  const pad = (n: number) => String(n).padStart(2, '0');

  if (compact) {
    return (
      <span className="font-mono tabular-nums">
        {days > 0 ? `${days}d ` : ''}{pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </span>
    );
  }

  return (
    <div className="flex items-baseline gap-2 font-mono tabular-nums">
      {days > 0 && (
        <div className="text-center">
          <div className="text-3xl font-bold text-[color:var(--brand)]">{days}</div>
          <div className="text-xs text-[color:var(--fg-muted)]">天</div>
        </div>
      )}
      <div className="text-center">
        <div className="text-3xl font-bold">{pad(hours)}</div>
        <div className="text-xs text-[color:var(--fg-muted)]">时</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{pad(minutes)}</div>
        <div className="text-xs text-[color:var(--fg-muted)]">分</div>
      </div>
      <div className="text-center">
        <div className="text-3xl font-bold">{pad(seconds)}</div>
        <div className="text-xs text-[color:var(--fg-muted)]">秒</div>
      </div>
    </div>
  );
}