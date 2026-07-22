import { ReactNode } from 'react';

type TabsProps = {
  children: ReactNode;
};

export function Tabs({ children }: TabsProps) {
  return <div className="flex gap-2">{children}</div>;
}
