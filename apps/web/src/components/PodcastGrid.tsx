import React from 'react';

import { graphql, useFragment } from 'react-relay';
import { twJoin as cn } from 'tailwind-merge';

import { PodcastCard } from './PodcastCard';

import { PodcastGrid_podcastsQuery$key } from './__generated__/PodcastGrid_podcastsQuery.graphql';

interface PodcastGridProps {
  className?: string;
  data: PodcastGrid_podcastsQuery$key;
}

const PodcastGrid: React.FC<PodcastGridProps> = ({ data, className }) => {
  const podcasts = useFragment(
    graphql`
      fragment PodcastGrid_podcastsQuery on Query {
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
    <div className={cn('grid grid-cols-[repeat(auto-fill,minmax(268px,1fr))] gap-2', className)}>
      {podcasts.podcasts && podcasts.podcasts.edges.map(podcast =>
        podcast && <PodcastCard key={podcast.node.id} data={podcast.node} />
      )}
    </div>
  );
};

export default PodcastGrid;
