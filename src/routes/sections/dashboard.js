import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from 'src/auth/guard';
// layouts
import DashboardLayout from 'src/layouts/dashboard';
// components
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// OVERVIEW
const IndexPage = lazy(() => import('src/pages/dashboard/app'));
const OverviewAnalyticsPage = lazy(() => import('src/pages/dashboard/analytics'));
// FILE MANAGER
const FileManagerPage = lazy(() => import('src/pages/dashboard/file-manager'));
// LETTER MANAGER
const LetterManagerPage = lazy(() => import('src/pages/dashboard/letter-manager'));
// PAYMENT
const PaymentPage = lazy(() => import('src/pages/dashboard/payment'));
// APP
const BillingPage = lazy(() => import('src/pages/dashboard/billing'));
const MailPage = lazy(() => import('src/pages/dashboard/mail'));
// BLANK PAGE
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'analytics', element: <OverviewAnalyticsPage /> },
      { path: 'file-manager', element: <FileManagerPage /> },
      { path: 'letter-manager', element: <LetterManagerPage />},
      { path: 'mail', element: <MailPage /> },
      { path: 'billing', element: <BillingPage /> },
      { path: 'blank', element: <BlankPage /> },
      { path: 'payment', element: <PaymentPage />}
    ],
  },
];
