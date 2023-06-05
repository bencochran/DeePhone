import React from 'react';
import { useLoaderData, defer, Await } from 'react-router-dom';
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  loadQuery,
  Environment,
} from 'react-relay';
import * as HomeQuery from './__generated__/HomeQuery.graphql';

import { Page } from '@/components/Page';
import { Card } from '@/components/Card';
import { CallList } from '@/components/CallList';
import { PodcastCards } from '@/components/PodcastCards';

export const loadHome = (environment: Environment) =>
  defer({ loadQuery: loadQuery(environment, HomeQuery.default, {}) });

interface HomeContentProps {
  initialQueryRef: PreloadedQuery<HomeQuery.HomeQuery>;
}

const HomeContent: React.FC<HomeContentProps> = ({ initialQueryRef }) => {
  const data = usePreloadedQuery(
    graphql`
      query HomeQuery {
        ...PodcastCardsQuery
        ...CallListQuery @arguments(first: 10)
      }
    `,
    initialQueryRef
  );

  return (
    <Page title='Home'>
      <Card>
        <div className='mb-4'>
          <h2 className='text-slate-900 dark:text-slate-300 font-medium text-2xl'>
            Recent calls
          </h2>
        </div>
        <CallList data={data} />
      </Card>
      <PodcastCards data={data} />
    </Page>
  );
};

export const Home: React.FC = () => {
  const data = useLoaderData() as any;
  return (
    <React.Suspense fallback={<p>Loading</p>}>
      <Await resolve={data.loadQuery} errorElement={<p>Error loading.</p>}>
        {ref => <HomeContent initialQueryRef={ref as any} />}
      </Await>
    </React.Suspense>
  );
};
