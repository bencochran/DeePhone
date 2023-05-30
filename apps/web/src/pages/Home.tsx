import React from 'react';

import { graphql, QueryRenderer, useRelayEnvironment } from 'react-relay';
import { HomeQuery } from './__generated__/HomeQuery.graphql';

import PodcastGrid from '@/components/PodcastGrid';

export const Home: React.FC = () => {
  const environment = useRelayEnvironment();
  return (
    <QueryRenderer<HomeQuery>
      environment={environment}
      query={graphql`
        query HomeQuery {
          ...PodcastGrid_podcastsQuery
        }
      `}
      variables={{ limit: 10 }}
      render={({ props }) =>
        <div className='mx-8 my-6'>
          <h2 className='text-slate-900 dark:text-slate-300 font-medium text-3xl mb-4'>
            Podcasts
          </h2>
          {props ? (
            <PodcastGrid
              data={props}
            />
          ) : (
            <p>Loading</p>
          )}
        </div>
      }
    />
  );
}
