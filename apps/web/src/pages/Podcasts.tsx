import React from 'react';
import { useLoaderData, defer, Await } from 'react-router-dom';
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  loadQuery,
  Environment,
} from 'react-relay';
import * as PodcastsQuery from './__generated__/PodcastsQuery.graphql';

import { Page } from '@/components/Page';
import { PodcastCards } from '@/components/PodcastCards';

export const loadPodcasts = (environment: Environment) =>
  defer({ loadQuery: loadQuery(environment, PodcastsQuery.default, {}) });

interface PodcastsContentProps {
  initialQueryRef: PreloadedQuery<PodcastsQuery.PodcastsQuery>;
}

const PodcastsContent: React.FC<PodcastsContentProps> = ({
  initialQueryRef,
}) => {
  const data = usePreloadedQuery(
    graphql`
      query PodcastsQuery {
        ...PodcastCardsQuery
      }
    `,
    initialQueryRef
  );

  return (
    <Page title='Podcasts'>
      <PodcastCards data={data} />
    </Page>
  );
};

export const Podcasts: React.FC = () => {
  const data = useLoaderData() as any;
  return (
    <React.Suspense fallback={<p>Loading</p>}>
      <Await resolve={data.loadQuery} errorElement={<p>Error loading.</p>}>
        {ref => <PodcastsContent initialQueryRef={ref as any} />}
      </Await>
    </React.Suspense>
  );
};
