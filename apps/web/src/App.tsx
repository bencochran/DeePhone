import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { RelayEnvironmentProvider } from 'react-relay';

import RelayEnvironment from './RelayEnvironment';

import { Home } from './pages/Home';
import { ErrorPage } from './error-page';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
]);


export const App: React.FC = () =>
  <React.StrictMode>
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <RouterProvider router={router} />
    </RelayEnvironmentProvider>
  </React.StrictMode>;
