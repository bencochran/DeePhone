import React from 'react';
import { usePreloadedQuery, graphql, PreloadedQuery } from 'react-relay';

import { CallEventRow } from '@/components/CallEventRow';

import * as CallEventsListQuery from './__generated__/CallEventsListQuery.graphql';

interface CallEventsListProps extends React.HTMLProps<HTMLDivElement> {
  queryReference: PreloadedQuery<CallEventsListQuery.CallEventsListQuery>;
  className?: string;
}

export const CallEventsList: React.FC<CallEventsListProps> = ({ queryReference, className }) => {
  const { call } = usePreloadedQuery(
    graphql`
      query CallEventsListQuery($callId: Int!) {
        call(identifier: $callId) {
          startDate
          events(oldestFirst: true, first: 100) {
            edges {
              node {
                id
                ...CallEventRow_callEvent
              }
            }
          }
        }
      }
    `,
    queryReference
  )
  return (
    <>
    {call && call.events.edges.length > 0 ? (
      <table className={className}>
        <tbody>
          {call.events.edges.map((edge, i) => edge &&
            <CallEventRow
              key={edge.node.id}
              data={edge.node}
              isFirstEvent={i === 0}
              startTime={new Date(call.startDate)}
            />
          )}
        </tbody>
      </table>
    ) : (
      <p>No events</p>
    )}
    </>
  );
};
