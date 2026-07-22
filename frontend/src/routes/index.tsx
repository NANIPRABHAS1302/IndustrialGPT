import { lazy, Suspense, type JSX } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { ROUTES } from '@/constants/routes';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { BlankLayout } from '@/layouts/BlankLayout';
import { DashboardSkeleton } from '@/components/skeletons/DashboardSkeleton';

const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const ChatPage = lazy(() => import('@/pages/ChatPage').then((module) => ({ default: module.ChatPage })));
const DocumentsPage = lazy(() => import('@/pages/DocumentsPage').then((module) => ({ default: module.DocumentsPage })));
const GraphPage = lazy(() => import('@/pages/GraphPage').then((module) => ({ default: module.GraphPage })));
const MaintenancePage = lazy(() => import('@/pages/MaintenancePage').then((module) => ({ default: module.MaintenancePage })));
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then((module) => ({ default: module.SettingsPage })));
const AuthPage = lazy(() => import('@/pages/AuthPage').then((module) => ({ default: module.AuthPage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })));

function withSuspense(element: JSX.Element) {
  return <Suspense fallback={<DashboardSkeleton />}>{element}</Suspense>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.dashboard} element={withSuspense(<DashboardPage />)} />
          <Route path={ROUTES.chat} element={withSuspense(<ChatPage />)} />
          <Route path={ROUTES.documents} element={withSuspense(<DocumentsPage />)} />
          <Route path={ROUTES.graph} element={withSuspense(<GraphPage />)} />
          <Route path={ROUTES.maintenance} element={withSuspense(<MaintenancePage />)} />
          <Route path={ROUTES.analytics} element={withSuspense(<AnalyticsPage />)} />
          <Route path={ROUTES.settings} element={withSuspense(<SettingsPage />)} />
        </Route>
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={withSuspense(<AuthPage />)} />
        <Route path="/forgot-password" element={withSuspense(<AuthPage />)} />
        <Route path="/reset-password" element={withSuspense(<AuthPage />)} />
      </Route>

      <Route element={<BlankLayout />}>
        <Route path="*" element={withSuspense(<NotFoundPage />)} />
      </Route>
    </Routes>
  );
}
