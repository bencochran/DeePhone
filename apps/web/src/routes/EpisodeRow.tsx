import React from 'react';

import { graphql, useFragment } from 'react-relay';
import { EpisodeRow_episode$key } from './__generated__/EpisodeRow_episode.graphql';

interface Props {
  data: EpisodeRow_episode$key;
}

export const EpisodeRow: React.FC<Props> = ({ data }) => {
  const episode = useFragment(
    graphql`
      fragment EpisodeRow_episode on Episode {
        title
        publishDate
        imageURL
        callCount
      }
    `,
    data
  );

  const formattedPublishDate = React.useMemo(() => {
    return Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(episode.publishDate));
  }, [episode.publishDate]);

  return (
    <div className='flex flex-row gap-2 items-center'>
      {episode.imageURL &&
        <div className='flex-grow-0 aspect-square w-12 rounded overflow-hidden'>
          <img src={episode.imageURL} className='w-full h-full object-cover' />
        </div>
      }
      <div className='flex-grow flex flex-col'>
        <p className='font-medium text-slate-900 dark:text-slate-100'>{episode.title}</p>
        <p className='text-sm text-slate-400 dark:text-slate-400'>{formattedPublishDate}</p>
      </div>
      {episode.callCount> 0 &&
        <div className='flex-grow-0'>
          <div className='aspect-square p-2 bg-slate-300/80 dark:bg-slate-600 rounded-full overflow-hidden flex flex-col items-center justify-center text-slate-600 dark:text-slate-300 font-medium h-8'>
            <span
              className='leading-5'
              title={`${episode.callCount} ${episode.callCount === 1 ? 'call' : 'calls'}`}
            >
              {episode.callCount}
            </span>
          </div>
        </div>
      }
    </div>
  );
}
