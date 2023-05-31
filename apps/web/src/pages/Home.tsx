import React from 'react';
import { useLoaderData, defer, Await } from 'react-router-dom';
import { graphql, PreloadedQuery, usePreloadedQuery, loadQuery, Environment } from 'react-relay';
import * as HomeQuery from './__generated__/HomeQuery.graphql';

import PodcastGrid from '@/components/PodcastGrid';

export const loadHome = (environment: Environment) =>
  defer({ loadQuery: loadQuery(environment, HomeQuery.default, {}) });

interface HomeContentProps {
  initialQueryRef: PreloadedQuery<HomeQuery.HomeQuery>
}

const HomeContent: React.FC<HomeContentProps> = ({ initialQueryRef }) => {
  const data = usePreloadedQuery(
    graphql`
      query HomeQuery {
        ...PodcastGrid_podcastsQuery
      }
    `,
    initialQueryRef
  );

  return (
    <div className='mx-8 my-6'>
      <h2 className='text-slate-900 dark:text-slate-300 font-medium text-3xl mb-4'>
        Podcasts
      </h2>
      {data ? (
        <PodcastGrid
          data={data}
        />
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}

export const Home: React.FC = () => {
  const data = useLoaderData() as any;
  return (
    <React.Suspense
      fallback={<p>Loading</p>}
    >
      <Await
        resolve={data.loadQuery}
        errorElement={<p>Error loading.</p>}
      >
        {(ref) => <HomeContent initialQueryRef={ref as any} />}
      </Await>
    </React.Suspense>
  );
}
