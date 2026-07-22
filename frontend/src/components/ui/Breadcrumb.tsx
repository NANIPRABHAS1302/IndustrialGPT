import { ReactNode } from 'react';

type BreadcrumbProps = {
  children: ReactNode;
};

export function Breadcrumb({ children }: BreadcrumbProps) {
  return <nav className="flex items-center gap-2 text-sm text-slate-400">{children}</nav>;
}
