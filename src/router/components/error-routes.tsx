import { Outlet, type RouteObject } from 'react-router-dom';
import ProtectedRoute from '@/router/components/protected-route';
import Page403 from '@/pages/error/Page403';
import Page404 from '@/pages/error/Page404';
import { Suspense } from 'react';
import { CircleLoading } from '@/components/loading/circle-loading';

export const ERROR_ROUTE: RouteObject = {
  element: (
    <ProtectedRoute>
      <Suspense fallback={<CircleLoading />}>
        <Outlet />
      </Suspense>
    </ProtectedRoute>
  ),
  children: [
    { path: '403', element: <Page403 /> },
    { path: '404', element: <Page404 /> },
  ],
};
