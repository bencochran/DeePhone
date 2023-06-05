import React from 'react';
import { useFragment, graphql } from 'react-relay';
import { twMerge as cn } from 'tailwind-merge';

import { PodcastHeader_podcast$key } from './__generated__/PodcastHeader_podcast.graphql';

interface PodcastHeaderProps {
  data: PodcastHeader_podcast$key;
  className?: string;
}

export const PodcastHeader: React.FC<PodcastHeaderProps> = ({
  data,
  className,
}) => {
  const { title, imageURL } = useFragment(
    graphql`
      fragment PodcastHeader_podcast on Podcast {
        title
        imageURL
      }
    `,
    data
  );

  return (
    <div className={cn('flex flex-row items-center gap-3', className)}>
      {imageURL && (
        <img
          className="aspect-square h-12 rounded"
          src={imageURL}
          alt={title}
        />
      )}
      <h2 className="text-slate-900 dark:text-slate-300 font-medium text-3xl">
        {title}
      </h2>
    </div>
  );
};
