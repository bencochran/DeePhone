import React from 'react';
import { useLoaderData, defer, Await } from 'react-router-dom';
import { graphql, PreloadedQuery, usePreloadedQuery, loadQuery, Environment } from 'react-relay';

import { Page } from '@/components/Page';
import { Card } from '@/components/Card';
import { CallList } from '@/components/CallList';

import * as CallsQuery from './__generated__/CallsQuery.graphql';

export const loadCalls = (environment: Environment) =>
  defer({ loadQuery: loadQuery(environment, CallsQuery.default, {}) });

interface CallsContentProps {
  initialQueryRef: PreloadedQuery<CallsQuery.CallsQuery>
}

const CallsContent: React.FC<CallsContentProps> = ({ initialQueryRef }) => {
  const data = usePreloadedQuery(
    graphql`
      query CallsQuery {
        ...CallListQuery
      }
    `,
    initialQueryRef,
  );

  return (
    <Page title='Recent calls'>
      <Card className='max-w-[320px]'>
        <CallList data={data} />
      </Card>
    </Page>
  );
}

export const Calls: React.FC = () => {
  const data = useLoaderData() as any;
  return (
    <React.Suspense
      fallback={<p>Loading</p>}
    >
      <Await
        resolve={data.loadQuery}
        errorElement={<p>Error loading.</p>}
      >
        {(ref) => <CallsContent initialQueryRef={ref} />}
      </Await>
    </React.Suspense>
  );
}
