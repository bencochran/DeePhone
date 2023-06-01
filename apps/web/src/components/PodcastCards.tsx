import React from 'react';
import { graphql, useFragment } from 'react-relay';

import { PodcastCard } from './PodcastCard';

import { PodcastCardsQuery$key } from './__generated__/PodcastCardsQuery.graphql';

interface PodcastCardsProps {
  data: PodcastCardsQuery$key;
}

export const PodcastCards: React.FC<PodcastCardsProps> = ({ data }) => {
  const podcasts = useFragment(
    graphql`
      fragment PodcastCardsQuery on Query {
        podcasts(first: 10) {
          edges {
            node {
              id
              ...PodcastCard_podcast
            }
          }
        }
      }
    `,
    data
  );

  return (
    <>
      {podcasts.podcasts && podcasts.podcasts.edges.map(podcast =>
        podcast && <PodcastCard key={podcast.node.id} data={podcast.node} />
      )}
    </>
  );
};
