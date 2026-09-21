// 倒计时：到比赛日期 0:00
import { getExamDateOverride } from './storage';
import { contest } from '@/data';

export function getExamDate(): Date {
  const override = getExamDateOverride();
  const dateStr = override || contest.examDate;
  // 默认比赛日 09:00 开始
  return new Date(`${dateStr}T09:00:00+08:00`);
}

export function countdownParts(target: Date, now: Date = new Date()): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  passed: boolean;
} {
  const ms = target.getTime() - now.getTime();
  if (ms <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true };
  }
  const totalSec = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    passed: false,
  };
}

export function formatExamDate(d: Date = getExamDate()): string {
  const wd = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}（周${wd}）`;
}