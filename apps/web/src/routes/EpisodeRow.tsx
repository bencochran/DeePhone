import React from 'react';
import { twMerge as cn } from 'tailwind-merge'
import { graphql, useFragment } from 'react-relay';
import { EpisodeRow_episode$key } from './__generated__/EpisodeRow_episode.graphql';

interface Props {
  data: EpisodeRow_episode$key;
  className?: string;
}

export const EpisodeRow: React.FC<Props & Omit<React.HTMLProps<HTMLDivElement>, 'data'>> = ({ data, className, ...props }) => {
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
    <div className={cn('flex flex-row gap-2 items-center group', className)} {...props}>
      {episode.imageURL &&
        <div className='flex-grow-0 flex-shrink-0 aspect-square w-12 rounded-sm overflow-hidden'>
          <img src={episode.imageURL} className='w-full h-full object-cover' />
        </div>
      }
      <div className='flex-grow flex flex-col'>
        <p className='font-medium text-slate-900 dark:text-slate-100 group-hover:dark:text-slate-50 group-active:dark:text-slate-50'>{episode.title}</p>
        <p className='text-sm text-slate-400 dark:text-slate-400 group-hover:text-slate-500 group-hover:dark:text-slate-300 group-active:text-slate-600 group-active:dark:text-slate-100'>{formattedPublishDate}</p>
      </div>
      {episode.callCount> 0 &&
        <div className='flex-grow-0 flex-shrink-0'>
          <div className='aspect-square p-2 bg-slate-300/80 dark:bg-slate-600 group-hover:bg-slate-400/50 group-hover:dark:bg-slate-500 group-active:bg-slate-400/80 group-active:dark:bg-slate-400 rounded-full overflow-hidden flex flex-col items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-slate-700 group-hover:dark:text-slate-200 group-active:text-slate-800 group-active:dark:text-slate-50 font-medium h-8'>
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
