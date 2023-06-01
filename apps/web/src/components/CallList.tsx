import React from 'react';
import { graphql, useFragment, useQueryLoader } from 'react-relay';
import { twMerge as cn } from 'tailwind-merge';

import { CallRow } from '@/components/CallRow';
import { CallEventsList } from '@/components/CallEventsList';
import { Spinner } from '@/components/Spinner';

import { CallListQuery$key } from './__generated__/CallListQuery.graphql'
import * as CallEventsListQuery from '@/components/__generated__/CallEventsListQuery.graphql';

export interface CallListProps {
  data: CallListQuery$key;
  className?: string;
}

export const CallList: React.FC<CallListProps> = ({ data, className }) => {
  const { calls } = useFragment(
    graphql`
      fragment CallListQuery on Query {
        calls(first: 10) {
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

  const [expandedCallIdentifier, setExpandedCallIdentifier] = React.useState<number | null>(null);
  const [nextExpandedCallIdentifier, setNextExpandedCallIdentifier] = React.useState<number | null>(null);

  const [loadingEvents, startTransition] = React.useTransition();
  const [queryReference, loadQuery] = useQueryLoader<CallEventsListQuery.CallEventsListQuery>(CallEventsListQuery.default /*, initialQuertRef */);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {calls.edges.map(edge => edge &&
        <div
          key={edge.node.id}
          className='flex flex-col'
        >
          <button
            className='text-left -m-1 p-1 hover:bg-slate-200 hover:dark:bg-slate-700 active:bg-slate-300 active:dark:bg-slate-600 rounded cursor-pointer'
            onClick={() => {
              setNextExpandedCallIdentifier(i => i === edge.node.identifier ? null : edge.node.identifier)
              startTransition(() => {
                setExpandedCallIdentifier(i => i === edge.node.identifier ? null : edge.node.identifier)
                loadQuery({ callId: edge.node.identifier, first: 50 });
              })
            }}
          >
            <CallRow data={edge.node} />
          </button>
          {expandedCallIdentifier === edge.node.identifier && queryReference &&
            <CallEventsList
              className='mt-2 mb-4'
              queryReference={queryReference}
            />
          }
          {(nextExpandedCallIdentifier === edge.node.identifier && loadingEvents) &&
            <div className='flex flex-row justify-center items-center h-6 mt-2'>
              <Spinner size='sm' />
            </div>
          }
        </div>
      )}
    </div>
  );
};
