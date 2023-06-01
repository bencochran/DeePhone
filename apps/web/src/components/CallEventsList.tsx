import React from 'react';
import { usePreloadedQuery, graphql, PreloadedQuery, usePaginationFragment } from 'react-relay';
import { twMerge as cn } from 'tailwind-merge';

import { CallEventRow } from '@/components/CallEventRow';
import { Spinner } from '@/components/Spinner';

import * as CallEventsListQuery from './__generated__/CallEventsListQuery.graphql';
import { CallEventsListQuery_call$key } from './__generated__/CallEventsListQuery_call.graphql';
import { CallEventsListEventPaginationQuery } from './__generated__/CallEventsListEventPaginationQuery.graphql';

interface CallEventsListProps extends React.HTMLProps<HTMLDivElement> {
  queryReference: PreloadedQuery<CallEventsListQuery.CallEventsListQuery>;
  className?: string;
}

export const CallEventsList: React.FC<CallEventsListProps> = ({ queryReference, className }) => {
  const fetched = usePreloadedQuery(
    graphql`
      query CallEventsListQuery($callId: Int!, $cursor: ID, $first: Int!) {
        call(identifier: $callId) {
          startDate
          ...CallEventsListQuery_call
        }
      }
    `,
    queryReference
  );

  const {
    data,
    loadNext,
    hasNext,
    isLoadingNext
  } = usePaginationFragment<CallEventsListEventPaginationQuery, CallEventsListQuery_call$key>(
    graphql`
      fragment CallEventsListQuery_call on Call
        @refetchable(queryName: "CallEventsListEventPaginationQuery") {
        events(
          oldestFirst: true,
          first: $first,
          after: $cursor
        ) @connection(key: "Call_events") {
          edges {
            node {
              id
              ...CallEventRow_callEvent
            }
          }
        }
      }
    `,
    fetched.call
  );

  const { call } = fetched;

  if (!call || !data || data.events.edges.length === 0) {
    return (
      <div className='flex flex-row justify-center items-center h-6 mt-2'>
        <p
          className='italic text-slate-500 dark:text-slate-400 text-center'
        >
          No call events
        </p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <table>
        <tbody>
          {data.events.edges.map((edge, i) => edge &&
            <CallEventRow
              key={edge.node.id}
              data={edge.node}
              isFirstEvent={i === 0}
              startTime={new Date(call.startDate)}
            />
          )}
        </tbody>
      </table>
      {hasNext &&
        <button
          className='text-blue-600 hover:text-blue-700 active:text-blue-800 dark:text-blue-500 dark:hover:text-blue-100 dark:active:text-blue-50 font-medium hover:bg-blue-100 active:bg-blue-200 dark:hover:bg-blue-900 dark:active:bg-blue-800 h-7 rounded mt-2 flex flex-row items-center justify-center gap-2'
          onClick={() => loadNext(50)}
        >
          {isLoadingNext ? (
            <>
              <Spinner className='text-inherit' size='sm' />
              <span className='block'>Loading…</span>
            </>
          ) : (
            <span className='block'>More events</span>
          )}
        </button>
      }
    </div>
  );
};
