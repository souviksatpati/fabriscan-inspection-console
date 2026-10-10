import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { AppLayout } from '../layouts/AppLayout';
import { RequireRole, AppIndexRedirect } from './RequireRole';
import { LoadingState } from '../components/common/LoadingState';

// Lazy-loaded Public Pages
const Home = lazy(() => import('../pages/public/Home'));
const About = lazy(() => import('../pages/public/About'));
const Login = lazy(() => import('../pages/public/Login'));
const NotFound = lazy(() => import('../pages/public/NotFound'));

// Lazy-loaded Inspection App Pages
const LiveInspection = lazy(() => import('../pages/app/LiveInspection'));
const Production = lazy(() => import('../pages/app/Production'));
const Defects = lazy(() => import('../pages/app/Defects'));
const Reports = lazy(() => import('../pages/app/Reports'));
const Cameras = lazy(() => import('../pages/app/Cameras'));
const SystemHealth = lazy(() => import('../pages/app/SystemHealth'));
const Settings = lazy(() => import('../pages/app/Settings'));
const Operators = lazy(() => import('../pages/app/Operators'));
const Profile = lazy(() => import('../pages/app/Profile'));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingState message="Loading Subsystem..." subMessage="Fetching module bundle" />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  // Standalone Login Screen
  {
    path: '/login',
    element: <SuspenseWrapper><Login /></SuspenseWrapper>,
  },

  // Public Marketing Website
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <SuspenseWrapper><Home /></SuspenseWrapper> },
      { path: 'about', element: <SuspenseWrapper><About /></SuspenseWrapper> },
      { path: '*', element: <SuspenseWrapper><NotFound /></SuspenseWrapper> },
    ],
  },

  // Protected Inspection Control Room
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        element: <RequireRole />,
        children: [
          { index: true, element: <AppIndexRedirect /> },
          { path: 'live-inspection', element: <SuspenseWrapper><LiveInspection /></SuspenseWrapper> },
          { path: 'production', element: <SuspenseWrapper><Production /></SuspenseWrapper> },
          { path: 'defects', element: <SuspenseWrapper><Defects /></SuspenseWrapper> },
          { path: 'reports', element: <SuspenseWrapper><Reports /></SuspenseWrapper> },
          { path: 'cameras', element: <SuspenseWrapper><Cameras /></SuspenseWrapper> },
          { path: 'system-health', element: <SuspenseWrapper><SystemHealth /></SuspenseWrapper> },
          { path: 'settings', element: <SuspenseWrapper><Settings /></SuspenseWrapper> },
          { path: 'operators', element: <SuspenseWrapper><Operators /></SuspenseWrapper> },
          { path: 'profile', element: <SuspenseWrapper><Profile /></SuspenseWrapper> },
        ],
      },
    ],
  },
]);
