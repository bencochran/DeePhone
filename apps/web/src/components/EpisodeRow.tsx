import React from 'react';
import { twMerge as cn } from 'tailwind-merge'
import { graphql, useFragment, useSubscription } from 'react-relay';
import { PhoneArrowDownLeftIcon } from '@heroicons/react/24/outline';
import { GraphQLSubscriptionConfig } from 'relay-runtime';

import { useFormattedDate } from '@/hooks/dates';

import { EpisodeRow_episode$key } from './__generated__/EpisodeRow_episode.graphql';
import { EpisodeRowSubscription } from './__generated__/EpisodeRowSubscription.graphql';

interface Props {
  data: EpisodeRow_episode$key;
  className?: string;
}

const useEpisodeUpdateSubscription = (episodeIdentifier: number) => {
  const config = React.useMemo<GraphQLSubscriptionConfig<EpisodeRowSubscription>>(() => {
    return {
      subscription: graphql`
        subscription EpisodeRowSubscription($episodeIdentifier: Int!) {
          episodeUpdated(episodeIdentifier: $episodeIdentifier) {
            episode {
              ...EpisodeRow_episode
            }
          }
        }
      `,
      variables: {
        episodeIdentifier,
      },
    };
  }, [episodeIdentifier]);

  useSubscription<EpisodeRowSubscription>(config);
}

export const EpisodeRow: React.FC<Props & Omit<React.HTMLProps<HTMLDivElement>, 'data'>> = ({ data, className, ...props }) => {
  const episode = useFragment(
    graphql`
      fragment EpisodeRow_episode on Episode {
        identifier
        title
        publishDate
        imageURL
        callCount
      }
    `,
    data
  );
  useEpisodeUpdateSubscription(episode.identifier);

  const formattedPublishDate = useFormattedDate(episode.publishDate, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/New_York',
  });

  return (
    <div className={cn('flex flex-row gap-2 items-center group', className)} {...props}>
      {episode.imageURL &&
        <div className='flex-grow-0 flex-shrink-0 aspect-square w-12 rounded overflow-hidden'>
          <img src={episode.imageURL} className='w-full h-full object-cover' />
        </div>
      }
      <div className='flex-grow flex flex-col min-w-0'>
        <p
          className='font-medium text-slate-900 dark:text-slate-100 group-hover:dark:text-slate-50 group-active:dark:text-slate-50 truncate'
        >
          {episode.title}
        </p>
        <p
          className='text-sm text-slate-400 dark:text-slate-400 group-hover:text-slate-500 group-hover:dark:text-slate-300 group-active:text-slate-600 group-active:dark:text-slate-100 truncate'
        >
          {formattedPublishDate}
        </p>
      </div>
      {episode.callCount> 0 &&
        <div
          className='ml-auto text-lg font-light text-slate-600 group-hover:text-slate-700 dark:text-slate-400 group-hover:dark:text-slate-300 flex flex-row items-center gap-1'
          data-tooltip-content={`Episode has received ${episode.callCount} ${episode.callCount === 1 ? 'call' : 'calls'}`}
          data-tooltip-id='dee-tooltip'
        >
          <p>{episode.callCount}</p>
          <PhoneArrowDownLeftIcon className='w-5 h-5 inline-block align-text-bottom' />
        </div>
      }
    </div>
  );
}
