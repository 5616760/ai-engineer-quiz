'use client';

import { Printer } from 'lucide-react';

export default function PrintButton({ label = '打印当前页' }: { label?: string }) {
  return (
    <button className="btn" onClick={() => typeof window !== 'undefined' && window.print()}>
      <Printer size={14} />
      <span className="text-xs">{label}</span>
    </button>
  );
}