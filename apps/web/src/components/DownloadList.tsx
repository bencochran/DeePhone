import React from 'react';
import { graphql, useFragment } from 'react-relay';

import { DownloadRow } from './DownloadRow';

import { DownloadList_episodeDownloadQuery$key } from './__generated__/DownloadList_episodeDownloadQuery.graphql';

interface DownloadListProps {
  data: DownloadList_episodeDownloadQuery$key;
}

export const DownloadList: React.FC<DownloadListProps> = ({ data }) => {
  const download = useFragment(
    graphql`
      fragment DownloadList_episodeDownloadQuery on Episode {
        downloads(first: 10) {
          edges {
            node {
              id
              ...DownloadRow_episodeDownload
            }
          }
        }
      }
    `,
    data
  );

  if (download.downloads.edges.length === 0) {
    return (
      <p className='italic text-slate-500 text-center'>
        No fetches
      </p>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      {download.downloads.edges.map(edge => edge &&
        <button
          key={edge.node.id}
          className='block text-left'
          onClick={() => alert(`Download ${edge.node.id}`)}
        >
          <DownloadRow
            className='-m-1 p-1 hover:bg-slate-200 hover:dark:bg-slate-700 active:bg-slate-300 active:dark:bg-slate-600 rounded cursor-pointer'
            data={edge.node}
          />
        </button>
      )}
    </div>
  );
};
