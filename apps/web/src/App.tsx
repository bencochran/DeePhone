import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import { Root } from './routes/root';
import { Other } from './routes/other';
import { ErrorPage } from './error-page';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/other",
    element: <Other />,
  }
]);


export const App: React.FC = () =>
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>;
