import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

type BadgeProps = {
  children: ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'danger';
};

export function Badge({ children, tone = 'default' }: BadgeProps) {
  const tones = {
    default: 'bg-slate-800/80 text-slate-300',
    success: 'bg-emerald-500/10 text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-400',
    danger: 'bg-rose-500/10 text-rose-400'
  };

  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium', tones[tone])}>{children}</span>;
}
