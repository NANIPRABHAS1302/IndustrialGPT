import { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <Card title={title} subtitle={subtitle}>
      {children}
    </Card>
  );
}
