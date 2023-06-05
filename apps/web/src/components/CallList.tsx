import React from 'react';
import {
  graphql,
  usePaginationFragment,
  useQueryLoader,
  useSubscription,
} from 'react-relay';
import { twMerge as cn } from 'tailwind-merge';
import { GraphQLSubscriptionConfig, ConnectionHandler } from 'relay-runtime';

import { CallRow } from '@/components/CallRow';
import { CallEventsList } from '@/components/CallEventsList';
import { Spinner } from '@/components/Spinner';

import { CallListQuery$key } from './__generated__/CallListQuery.graphql';
import * as CallEventsListQuery from '@/components/__generated__/CallEventsListQuery.graphql';
import { CallListNewCallsSubscription } from './__generated__/CallListNewCallsSubscription.graphql';

export interface CallListProps {
  data: CallListQuery$key;
  className?: string;
  episodeIdentifier?: number;
}

const useNewCallsSubscription = (episodeIdentifier?: number) => {
  const config = React.useMemo<
    GraphQLSubscriptionConfig<CallListNewCallsSubscription>
  >(() => {
    const connectionId = ConnectionHandler.getConnectionID(
      'client:root',
      'CallListQuery_calls',
      { episodeIdentifier }
    );
    return {
      subscription: graphql`
        subscription CallListNewCallsSubscription(
          $episodeIdentifier: Int
          $connections: [ID!]!
        ) {
          newCalls(episodeIdentifier: $episodeIdentifier) {
            edges @prependEdge(connections: $connections) {
              node {
                ...CallRow_call
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

  useSubscription<CallListNewCallsSubscription>(config);
};

export const CallList: React.FC<CallListProps> = ({
  data,
  className,
  episodeIdentifier,
}) => {
  const {
    data: { calls },
    hasNext,
    loadNext,
    isLoadingNext,
  } = usePaginationFragment(
    graphql`
      fragment CallListQuery on Query
      @refetchable(queryName: "CallListPaginationQuery")
      @argumentDefinitions(
        first: { type: "Int!" }
        cursor: { type: "ID" }
        episodeIdentifier: { type: "Int" }
      ) {
        calls(
          first: $first
          after: $cursor
          episodeIdentifier: $episodeIdentifier
        ) @connection(key: "CallListQuery_calls") {
          edges {
            node {
              id
              identifier
              ...CallRow_call
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `,
    data
  );

  useNewCallsSubscription(episodeIdentifier);

  const [expandedCallIdentifier, setExpandedCallIdentifier] = React.useState<
    number | null
  >(null);
  const [nextExpandedCallIdentifier, setNextExpandedCallIdentifier] =
    React.useState<number | null>(null);

  const [loadingEvents, startTransition] = React.useTransition();
  const [queryReference, loadQuery] =
    useQueryLoader<CallEventsListQuery.CallEventsListQuery>(
      CallEventsListQuery.default
    );

  if (calls.edges.length === 0) {
    return (
      <p className='italic text-slate-500 dark:text-slate-400 text-center'>
        No calls
      </p>
    );
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {calls.edges.map(
        edge =>
          edge && (
            <div key={edge.node.id} className='flex flex-col'>
              <button
                className='text-left -m-1 p-1 hover:bg-slate-200 hover:dark:bg-slate-700 active:bg-slate-300 active:dark:bg-slate-600 rounded cursor-pointer group'
                type='button'
                onClick={() => {
                  setNextExpandedCallIdentifier(i =>
                    i === edge.node.identifier ? null : edge.node.identifier
                  );
                  startTransition(() => {
                    setExpandedCallIdentifier(i =>
                      i === edge.node.identifier ? null : edge.node.identifier
                    );
                    loadQuery({
                      callIdentifier: edge.node.identifier,
                      first: 50,
                    });
                  });
                }}
              >
                <CallRow data={edge.node} />
              </button>
              {expandedCallIdentifier === edge.node.identifier &&
                queryReference && (
                  <CallEventsList
                    className='mt-2 mb-4'
                    queryReference={queryReference}
                  />
                )}
              {nextExpandedCallIdentifier === edge.node.identifier &&
                loadingEvents && (
                  <div className='flex flex-row justify-center items-center h-6 mt-2'>
                    <Spinner size='sm' />
                  </div>
                )}
            </div>
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
            <span className='block'>Load more calls</span>
          )}
        </button>
      )}
    </div>
  );
};
