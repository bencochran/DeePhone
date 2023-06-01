import React from 'react';
import { graphql, useFragment } from 'react-relay';
import { PodcastCard_podcast$key } from './__generated__/PodcastCard_podcast.graphql';

import { Card } from './Card';
import { EpisodeList } from './EpisodeList';

interface Props {
  data: PodcastCard_podcast$key;
}

export const PodcastCard: React.FC<Props> = ({ data }) => {
  const podcast = useFragment(
    graphql`
      fragment PodcastCard_podcast on Podcast {
        title
        imageURL
        ...EpisodeList_podcast
      }
    `,
    data
  );
  return (
    <Card className='flex flex-col gap-3'>
      <div className='aspect-square rounded overflow-hidden max-h-96 self-center'>
        {podcast.imageURL ? (
          <img
            className='object-cover'
            title={podcast.title}
            src={podcast.imageURL}
          />
        ) : (
          <div className='bg-slate-100 dark:bg-slate-700 h-full flex items-center justify-center'>
            <span className='text-slate-700 dark:text-slate-300 font-medium text-lg'>
              {podcast.title}
            </span>
          </div>
        )}
      </div>
      <EpisodeList data={podcast} />
    </Card>
  )
}
