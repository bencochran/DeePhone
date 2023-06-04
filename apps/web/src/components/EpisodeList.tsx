import React from 'react';
import { graphql, usePaginationFragment } from 'react-relay';
import { Link } from 'react-router-dom';

import { EpisodeRow } from './EpisodeRow';
import { Spinner } from './Spinner';

import { EpisodeList_podcast$key } from './__generated__/EpisodeList_podcast.graphql';

export interface EpisodeListProps {
  data: EpisodeList_podcast$key;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({ data }) => {
  const {
    data: { episodes },
    hasNext,
    loadNext,
    isLoadingNext,
  } = usePaginationFragment(
    graphql`
      fragment EpisodeList_podcast on Podcast
      @refetchable(queryName: "EpisodeListPaginationQuery")
      @argumentDefinitions(
        first: { type: "Int!" },
        cursor: { type: "ID" }
      ) {
        episodes(
          first: $first,
          after: $cursor
        ) @connection(key: "EpisodeList_podcast_episodes") {
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

  return (
    <>
    {episodes.edges.length > 0 ? (
      <div className='flex flex-col gap-1.5'>
        <p className='font-medium text-slate-800 dark:text-slate-100 text-lg'>
          {episodes.edges.length === 1 ? (
            'Recent episode'
          ) : (
            'Recent episodes'
          )}
        </p>
        <div className='flex flex-col gap-3'>
          {episodes.edges.map(edge => edge &&
            <Link
              key={edge.node.id}
              to={`/episode/${edge.node.identifier}`}
              className='text-left'
            >
              <EpisodeRow
                className='-m-1 p-1 hover:bg-slate-200 hover:dark:bg-slate-700 active:bg-slate-300 active:dark:bg-slate-600 rounded cursor-pointer'
                data={edge.node}
              />
            </Link>
          )}
          {hasNext &&
            <button
              className='text-white active:text-blue-100 dark:active:text-white font-medium bg-blue-500 hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 dark:active:bg-blue-500 py-2 px-4 rounded flex flex-row items-center justify-center gap-2'
              onClick={() => loadNext(4)}
            >
              {isLoadingNext ? (
                <>
                  <Spinner className='text-inherit' size='sm' />
                  <span className='block'>Loading…</span>
                </>
              ) : (
                <span className='block'>Load more episodes</span>
              )}
            </button>
          }
        </div>
      </div>
    ) : (
      <p className='italic text-slate-500 dark:text-slate-400 text-center'>
        No recent episodes
      </p>
    )}
    </>
  );
};
