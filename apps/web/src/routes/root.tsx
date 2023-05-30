import React from 'react';

import { graphql, QueryRenderer, useRelayEnvironment } from 'react-relay';
import { root_PodcastsQuery } from './__generated__/root_PodcastsQuery.graphql'

import { Podcast } from './Podcast';

export const Root: React.FC = () => {
  const environment = useRelayEnvironment();
  return (
    <QueryRenderer<root_PodcastsQuery>
      environment={environment}
      query={graphql`
        query root_PodcastsQuery {
          podcasts(first: 10) {
            edges {
              node {
                id
                ...Podcast_podcast
              }
            }
          }
        }
      `}
      variables={{ limit: 10 }}
      render={(data) =>
        <div>
          {data.props && data.props.podcasts.edges.map(podcast =>
            podcast && <Podcast key={podcast.node.id} data={podcast.node} />
          )}
        </div>
      }
    />
  );
}
