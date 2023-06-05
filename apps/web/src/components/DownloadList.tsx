import React from 'react';
import {
  graphql,
  useSubscription,
  ConnectionHandler,
  usePaginationFragment,
} from 'react-relay';
import { GraphQLSubscriptionConfig } from 'relay-runtime';

import { DownloadRow } from '@/components/DownloadRow';
import { Spinner } from '@/components/Spinner';

import { DownloadListQuery$key } from './__generated__/DownloadListQuery.graphql';
import { DownloadListNewDownloadsSubscription } from './__generated__/DownloadListNewDownloadsSubscription.graphql';

interface DownloadListProps {
  data: DownloadListQuery$key;
  episodeId: string;
  episodeIdentifier?: number;
}

const useNewDownloadsSubscription = (
  episodeId: string,
  episodeIdentifier?: number
) => {
  const config = React.useMemo<
    GraphQLSubscriptionConfig<DownloadListNewDownloadsSubscription>
  >(() => {
    const connectionId = ConnectionHandler.getConnectionID(
      episodeId,
      'Episode_downloads'
    );
    return {
      subscription: graphql`
        subscription DownloadListNewDownloadsSubscription(
          $episodeIdentifier: Int
          $connections: [ID!]!
        ) {
          newEpisodeDownlaods(episodeIdentifier: $episodeIdentifier) {
            edges @prependEdge(connections: $connections) {
              node {
                ...DownloadRow_episodeDownload
              }
            }
          }
        }
      `,
      variables: {
        episodeIdentifier,
        connections: [connectionId],
      },
    };
  }, [episodeIdentifier]);

  useSubscription<DownloadListNewDownloadsSubscription>(config);
};

export const DownloadList: React.FC<DownloadListProps> = ({
  data,
  episodeId,
  episodeIdentifier,
}) => {
  const {
    data: { episode },
    hasNext,
    loadNext,
    isLoadingNext,
  } = usePaginationFragment(
    graphql`
      fragment DownloadListQuery on Query
      @refetchable(queryName: "DownloadListPaginationQuery")
      @argumentDefinitions(
        first: { type: "Int" }
        cursor: { type: "ID" }
        episodeIdentifier: { type: "Int!" }
      ) {
        episode(identifier: $episodeIdentifier) {
          downloads(first: $first, after: $cursor)
            @connection(key: "Episode_downloads") {
            edges {
              node {
                id
                ...DownloadRow_episodeDownload
              }
            }
          }
        }
      }
    `,
    data
  );

  useNewDownloadsSubscription(episodeId, episodeIdentifier);

  if (!episode || episode.downloads.edges.length === 0) {
    return (
      <p className='italic text-slate-500 dark:text-slate-400 text-center'>
        No fetches
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      {episode.downloads.edges.map(
        edge =>
          edge && (
            <button
              key={edge.node.id}
              type='button'
              className='block text-left'
              // eslint-disable-next-line no-alert
              onClick={() => alert(`Download ${edge.node.id}`)}
            >
              <DownloadRow
                className='-m-1 p-1 hover:bg-slate-200 hover:dark:bg-slate-700 active:bg-slate-300 active:dark:bg-slate-600 rounded cursor-pointer'
                data={edge.node}
              />
            </button>
          )
      )}
      {hasNext && (
        <button
          className='text-white active:text-blue-100 dark:active:text-white font-medium bg-blue-500 hover:bg-blue-600 active:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 dark:active:bg-blue-500 py-2 px-4 rounded flex flex-row items-center justify-center gap-2'
          type='button'
          onClick={() => loadNext(10)}
        >
          {isLoadingNext ? (
            <>
              <Spinner className='text-inherit' size='sm' />
              <span className='block'>Loading…</span>
            </>
          ) : (
            <span className='block'>Load more fetches</span>
          )}
        </button>
      )}
    </div>
  );
};
