import React from 'react';
import { graphql, useFragment } from 'react-relay';
import { MicrophoneIcon, PhoneXMarkIcon } from '@heroicons/react/24/solid';
import { PhoneIcon as PhoneOutlineIcon } from '@heroicons/react/24/outline';
import { PhoneIcon } from '@heroicons/react/24/solid';

import { useYearOptionalFormattedDate } from '@/hooks/dates';
import { formatDuration } from '@/utils/date-and-time';

import { CallRow_call$key } from './__generated__/CallRow_call.graphql';

interface CallRowProps {
  data: CallRow_call$key;
  className?: string;
}

export const CallRow: React.FC<CallRowProps> = ({ data, className }) => {
  const {
    callerName,
    phoneNumber,
    startDate: startDateString,
    endDate: endDateString,
    episode,
  } = useFragment(
    graphql`
      fragment CallRow_call on Call {
        identifier,
        callerName
        phoneNumber
        startDate
        endDate
        episode {
          title
          imageURL
          podcast {
            title
            imageURL
          }
        }
      }
    `,
    data
  );

  const startDate = React.useMemo(() => new Date(startDateString), [startDateString]);
  const endDate = React.useMemo(() => endDateString ? new Date(endDateString) : null, [endDateString]);

  const formattedStartDate = useYearOptionalFormattedDate(startDate, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  const duration = React.useMemo(() => {
    if (!endDate) return null;
    const seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    return formatDuration(seconds)
  }, [startDate, endDate]);

  return (
    <div className={className}>
      <div className='flex flex-row items-center gap-2'>
        <div className='bg-slate-300 aspect-square h-12 rounded overflow-hidden'>
          {episode ? (
            <div
              className='w-full h-full flex items-center justify-center'
              data-tooltip-html={`${episode.podcast.title}<br />${episode.title}`}
              data-tooltip-id='dee-tooltip'
            >
              {episode.imageURL || episode.podcast.imageURL ? (
                <img src={episode.imageURL ?? episode.podcast.imageURL} className='w-full h-full object-cover' />
              ) : (
                <MicrophoneIcon
                  className='w-6 h-6 text-slate-400'
                />
              )}
            </div>
          ) : (
            <div
              className='w-full h-full flex items-center justify-center'
              data-tooltip-content='No episode played'
              data-tooltip-id='dee-tooltip'
            >
              <PhoneXMarkIcon
                className='w-6 h-6 text-slate-400'
              />
            </div>
          )}
        </div>
        <div className='flex flex-col min-w-0'>
          <p className='font-medium truncate'>
            {callerName ? (
              <>
                <span>{callerName}</span>
                {' - '}
                <span>{phoneNumber}</span>
              </>
            ) : (
              <span>{phoneNumber}</span>
            )}
          </p>
          <p className='text-sm truncate'>
            {formattedStartDate}
          </p>
        </div>
        <div className='flex flex-col items-end ml-auto whitespace-nowrap'>
          {duration ? (
            <p className=''>
              {duration}
            </p>
          ) : (
            <div
              className='relative w-5 h-5'
              data-tooltip-html={'Call in progress'}
              data-tooltip-id='dee-tooltip'
            >
              <PhoneIcon className='absolute w-5 h-5 text-green-600 inline-block align-text-bottom' />
              <PhoneOutlineIcon className='absolute w-5 h-5 text-green-600 inline-block align-text-bottom animate-phone-ping' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
