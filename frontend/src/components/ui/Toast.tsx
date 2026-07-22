import { ReactNode } from 'react';

type ToastProps = {
  children: ReactNode;
};

export function Toast({ children }: ToastProps) {
  return <div className="rounded-2xl border border-slate-800/80 bg-slate-900/95 px-4 py-3 text-sm text-slate-200 shadow-glow">{children}</div>;
}
