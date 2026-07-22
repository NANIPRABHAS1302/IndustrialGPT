import { ReactNode } from 'react';

type DrawerProps = {
  open: boolean;
  children: ReactNode;
};

export function Drawer({ open, children }: DrawerProps) {
  if (!open) return null;

  return <div className="fixed inset-y-0 right-0 z-40 w-80 border-l border-slate-800/80 bg-slate-950/95 p-4 shadow-glow">{children}</div>;
}
