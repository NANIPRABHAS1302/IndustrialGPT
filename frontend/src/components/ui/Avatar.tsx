import { ReactNode } from 'react';

type AvatarProps = {
  children: ReactNode;
  className?: string;
};

export function Avatar({ children, className = '' }: AvatarProps) {
  return <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-sm font-semibold text-white ${className}`}>{children}</div>;
}
