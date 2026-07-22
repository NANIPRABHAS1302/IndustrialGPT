import { ReactNode, Suspense } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryProvider>
          <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>
        </QueryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
