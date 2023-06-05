import React from 'react';
import { graphql, useFragment } from 'react-relay';
import { twMerge as cn } from 'tailwind-merge';
import { XMarkIcon, ArrowPathIcon } from '@heroicons/react/20/solid';
import { PhoneArrowDownLeftIcon } from '@heroicons/react/24/outline';

import { useYearOptionalFormattedDate } from '@/hooks/dates';

import { DownloadRow_episodeDownload$key } from './__generated__/DownloadRow_episodeDownload.graphql';

interface DownloadRowProps {
  data: DownloadRow_episodeDownload$key;
  className?: string;
}

export const DownloadRow: React.FC<DownloadRowProps> = ({
  data,
  className,
}) => {
  const { downloadDate, partCount, finished, deleted, callCount } = useFragment(
    graphql`
      fragment DownloadRow_episodeDownload on EpisodeDownload {
        downloadDate
        partCount
        finished
        deleted
        callCount
      }
    `,
    data
  );

  const formattedDate = useYearOptionalFormattedDate(downloadDate, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div className={cn('flex flex-row gap-2 items-center group', className)}>
      <div className="flex flex-col flex-shrink min-w-0">
        <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:dark:text-slate-50 group-active:dark:text-slate-50 truncate">
          {partCount} parts
          {!finished && (
            <ArrowPathIcon
              className="ml-1 w-4 h-4 text-blue-500 dark:text-blue-400 group-hover:text-blue-600 group-hover:dark:text-blue-300 inline-block"
              data-tooltip-content="Fetch still in progress or has failed"
              data-tooltip-id="dee-tooltip"
            />
          )}
          {deleted && (
            <XMarkIcon
              className="ml-1 w-4 h-4 text-red-500 dark:text-red-400 group-hover:text-red-600 group-hover:dark:text-red-300 inline-block"
              data-tooltip-content="Fetch has been deleted"
              data-tooltip-id="dee-tooltip"
            />
          )}
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-400 group-hover:text-slate-500 group-hover:dark:text-slate-300 group-active:text-slate-600 group-active:dark:text-slate-100 truncate">
          {formattedDate}
        </p>
      </div>
      {callCount > 0 && (
        <div
          className="ml-auto text-lg font-light text-slate-600 group-hover:text-slate-700 dark:text-slate-400 group-hover:dark:text-slate-300 flex flex-row items-center gap-1"
          data-tooltip-content={`Fetch has received ${callCount} ${
            callCount === 1 ? 'call' : 'calls'
          }`}
          data-tooltip-id="dee-tooltip"
        >
          <p>{callCount}</p>
          <PhoneArrowDownLeftIcon className="w-5 h-5 inline-block align-text-bottom" />
        </div>
      )}
    </div>
  );
};
