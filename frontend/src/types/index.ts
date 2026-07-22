export * from './app';

export type StatCard = {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
};
