import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import { Layout } from '@/components/Layout';
import { MeetAndGreetPage } from './pages/MeetAndGreetPage';
import { EngagementPage } from './pages/EngagementPage';
import { ObservationsPage } from './pages/ObservationsPage';
import { DogProfilePage } from './pages/DogProfilePage';
import { ShiftReportPage } from './pages/ShiftReportPage';
import { ManagerDashboardPage } from './pages/ManagerDashboardPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "meet-and-greet",
        element: <MeetAndGreetPage />,
      },
      {
        path: "engagement",
        element: <EngagementPage />,
      },
      {
        path: "observations",
        element: <ObservationsPage />,
      },
      {
        path: "dogs/:dogId",
        element: <DogProfilePage />,
      },
      {
        path: "shift-report",
        element: <ShiftReportPage />,
      },
      {
        path: "manager-dashboard",
        element: <ManagerDashboardPage />,
      },
    ]
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
)