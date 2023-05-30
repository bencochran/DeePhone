import React from 'react';

import { graphql, useFragment } from 'react-relay';
import { PodcastCard_podcast$key } from './__generated__/PodcastCard_podcast.graphql';

import { EpisodeRow } from './EpisodeRow';

interface Props {
  data: PodcastCard_podcast$key;
}

export const PodcastCard: React.FC<Props> = ({ data }) => {
  const podcast = useFragment(
    graphql`
      fragment PodcastCard_podcast on Podcast {
        title
        imageURL
        episodes(first: 4) {
          edges {
            node {
              id
              title
              ...EpisodeRow_episode
            }
          }
        }
      }
    `,
    data
  );

  return (
    <div className='p-2 rounded-lg bg-slate-50 dark:bg-slate-800 flex flex-col dark:text-white gap-3'>
      <div className='aspect-square rounded overflow-hidden'>
        {podcast.imageURL ? (
          <img
            className=''
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
      {podcast.episodes.edges.length > 0 ? (
        <div className='flex flex-col gap-1.5'>
          <p className='font-medium text-slate-800 dark:text-slate-100 text-lg'>
            {podcast.episodes.edges.length === 1 ? (
              'Recent episode'
            ) : (
              'Recent episodes'
            )}
          </p>
          <div className='flex flex-col gap-2'>
            {podcast.episodes.edges.map(edge => edge &&
              <button
                className='text-left'
                onClick={() => alert(`Selected ${edge.node.title}`)}
              >
                <EpisodeRow
                  key={edge.node.id}
                  className='-m-1 p-1 hover:bg-slate-200 hover:dark:bg-slate-700 active:bg-slate-300 active:dark:bg-slate-600 rounded cursor-pointer'
                  data={edge.node}
                />
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className='italic text-slate-500 text-center'>
          No recent episodes
        </p>
      )}
    </div>
  )
}
