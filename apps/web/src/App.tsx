import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { RelayEnvironmentProvider } from 'react-relay';
import { Tooltip } from 'react-tooltip';

import RelayEnvironment from './RelayEnvironment';

import { Home, loadHome } from './pages/Home';
import { Podcasts, loadPodcasts } from './pages/Podcasts';
import { Episode, loadEpisode } from './pages/Episode';
import { Calls, loadCalls } from './pages/Calls';
import { ErrorPage } from './error-page';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
    loader: () => loadHome(RelayEnvironment),
  },
    {
    path: "/podcasts",
    element: <Podcasts />,
    errorElement: <ErrorPage />,
    loader: () => loadPodcasts(RelayEnvironment),
  },
  {
    path: "/episode/:episodeId",
    element: <Episode />,
    errorElement: <ErrorPage />,
    loader: (args) => loadEpisode(RelayEnvironment, { episodeId: Number.parseInt(args.params.episodeId!, 10) }),
  },
  {
    path: "/calls",
    element: <Calls />,
    errorElement: <ErrorPage />,
    loader: () => loadCalls(RelayEnvironment),
  },
]);


export const App: React.FC = () =>
  <React.StrictMode>
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <RouterProvider router={router} />
      <Tooltip id='dee-tooltip' />
    </RelayEnvironmentProvider>
  </React.StrictMode>;
