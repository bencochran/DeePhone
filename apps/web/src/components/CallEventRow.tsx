import React from 'react';
import { graphql, useFragment } from 'react-relay';

import { useFormattedDate } from '@/hooks/dates';
import { formatDuration } from '@/utils/date-and-time';
import { formatFileSize } from '@/utils/size';

import {
  CallEventRow_callEvent$key,
  CallEventRow_callEvent$data,
} from './__generated__/CallEventRow_callEvent.graphql';

interface CallEventRowProps {
  data: CallEventRow_callEvent$key;
  startTime: Date;
}

function formatState(event: CallEventRow_callEvent$data): string {
  switch (event.type) {
    case 'ANSWERED':
      return 'Answered';
    case 'FETCHING_EPISODE':
      return 'Fetching episode';
    case 'WAITING_MESSAGE':
      return 'Waiting message while fetching episode';
    case 'EPISODE_READY':
      return 'Episode ready to play';
    case 'INTRODUCING_EPISODE':
      return 'Introducing episode';
    case 'PLAYING_EPISODE':
      if (event.part && event.download) {
        return `Playing part ${event.part.number} of ${event.download.partCount}`;
      }
      return 'Playing episode';
    case 'ENDING_EPISODE':
      return 'Outro';
    case 'NO_EPISODE':
      return 'No episode';
    case 'EPISODE_ERROR':
      return 'Error';
    case 'ENDED':
      return 'Call ended';
    // For having typescript complain if we forget to handle a new type:
    // case "%future added value":
    default:
      return 'Unknown';
  }
}

export const CallEventRow: React.FC<CallEventRowProps> = ({
  data,
  startTime,
}) => {
  const event = useFragment(
    graphql`
      fragment CallEventRow_callEvent on CallEvent {
        date
        type
        download {
          partCount
          episode {
            title
            publishDate
            imageURL
          }
        }
        part {
          number
          size
          duration
        }
      }
    `,
    data
  );

  const formattedTime = useFormattedDate(event.date, {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  const formattedTimeOffset = React.useMemo(() => {
    const date = new Date(event.date);
    const timeOffset = (date.getTime() - startTime.getTime()) / 1000;
    return formatDuration(timeOffset, {
      style: 'time',
      maximumUnit: 'minutes',
    });
  }, []);

  const formattedFileSize = React.useMemo(() => {
    if (!event.part) return null;
    const display = formatFileSize(event.part.size, {
      minimumUnit: 'MB',
      maximumUnit: 'MB',
    });
    const tooltip = formatFileSize(event.part.size);
    return {
      display,
      tooltip: display !== tooltip ? tooltip : undefined,
    };
  }, [event.part]);

  return (
    <tr className='hover:bg-slate-200/60 dark:hover:bg-slate-700/60'>
      <td className='w-[3rem] min-w-[3rem] text-right tabular-nums text-slate-500 dark:text-slate-400 font-light truncate'>
        <span title={formattedTime}>{formattedTimeOffset}</span>
      </td>
      <td className='w-full max-w-[1px] text-slate-700 dark:text-slate-300 truncate'>
        <span className='mx-2'>{formatState(event)}</span>
      </td>
      <td className='w-0 text-right text-slate-400 dark:text-slate-500 text-sm truncate'>
        {formattedFileSize ? (
          <span className='tabular-nums' title={formattedFileSize.tooltip}>
            {formattedFileSize.display}
          </span>
        ) : null}
      </td>
    </tr>
  );
};
