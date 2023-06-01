import React from 'react';
import { graphql, useFragment } from 'react-relay';
import { useNavigate } from 'react-router';

import { EpisodeRow } from './EpisodeRow';

import { EpisodeList_podcast$key } from './__generated__/EpisodeList_podcast.graphql';

export interface EpisodeListProps {
  data: EpisodeList_podcast$key;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({ data }) => {
  const podcast = useFragment(
    graphql`
      fragment EpisodeList_podcast on Podcast {
        episodes(first: 4) {
          edges {
            node {
              id
              identifier
              ...EpisodeRow_episode
            }
          }
        }
      }
    `,
    data
  );

  const navigate = useNavigate();

  return (
    <>
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
              key={edge.node.id}
              className='text-left'
              onClick={() => navigate(`/episode/${edge.node.identifier}`)}
            >
              <EpisodeRow
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
    </>
  );
};
