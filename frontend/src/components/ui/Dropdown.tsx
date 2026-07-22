import { ReactNode } from 'react';

type DropdownProps = {
  trigger: ReactNode;
  children: ReactNode;
};

export function Dropdown({ trigger, children }: DropdownProps) {
  return (
    <div className="relative">
      <div>{trigger}</div>
      <div className="absolute right-0 mt-2 min-w-48 rounded-2xl border border-slate-800/80 bg-slate-900/95 p-2 shadow-glow">{children}</div>
    </div>
  );
}
