import React from 'react';
import { graphql, useFragment } from 'react-relay';
import { twMerge as cn } from 'tailwind-merge';

import { useFormattedDate } from '@/hooks/dates';
import { SanitizedHTML } from './SanitizedHTML';

import { EpisodeHeader_episode$key } from './__generated__/EpisodeHeader_episode.graphql';

interface EpisodeHeaderProps {
  data: EpisodeHeader_episode$key;
  className?: string;
}

export const EpisodeHeader: React.FC<EpisodeHeaderProps> = ({
  data,
  className,
}) => {
  const episode = useFragment(
    graphql`
      fragment EpisodeHeader_episode on Episode {
        title
        publishDate
        imageURL
        description
      }
    `,
    data
  );

  const formattedPublishDate = useFormattedDate(episode.publishDate, {
    dateStyle: 'full',
    timeZone: 'America/New_York',
  });

  return (
    <div className={cn('flex flex-col', className)}>
      <div className='flex flex-col gap-2'>
        <div className='flex flex-row self-center gap-4'>
          {episode.imageURL && (
            <img
              className='max-h-80 rounded'
              src={episode.imageURL}
              alt={episode.title}
            />
          )}
        </div>
        <div>
          <p className='text-3xl'>{episode.title}</p>
          <p className='text-lg'>{formattedPublishDate}</p>
        </div>
        {episode.description && (
          <div className='mb-2'>
            <SanitizedHTML html={episode.description} />
          </div>
        )}
      </div>
    </div>
  );
};
