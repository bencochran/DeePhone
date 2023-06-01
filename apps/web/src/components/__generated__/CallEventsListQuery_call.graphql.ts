/**
 * @generated SignedSource<<fdcb21f8684a3e7007af40d93633e955>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CallEventsListQuery_call$data = {
  readonly events: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"CallEventRow_callEvent">;
      };
    } | null>;
  };
  readonly id: string;
  readonly " $fragmentType": "CallEventsListQuery_call";
};
export type CallEventsListQuery_call$key = {
  readonly " $data"?: CallEventsListQuery_call$data;
  readonly " $fragmentSpreads": FragmentRefs<"CallEventsListQuery_call">;
};

import CallEventsListEventPaginationQuery_graphql from './CallEventsListEventPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "events"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "cursor"
    },
    {
      "kind": "RootArgument",
      "name": "first"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": "first",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "first",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [
        "node"
      ],
      "operation": CallEventsListEventPaginationQuery_graphql,
      "identifierField": "id"
    }
  },
  "name": "CallEventsListQuery_call",
  "selections": [
    {
      "alias": "events",
      "args": [
        {
          "kind": "Literal",
          "name": "oldestFirst",
          "value": true
        }
      ],
      "concreteType": "CallEventsConnection",
      "kind": "LinkedField",
      "name": "__Call_events_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CallEventsConnectionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "CallEvent",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v1/*: any*/),
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "CallEventRow_callEvent"
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "__Call_events_connection(oldestFirst:true)"
    },
    (v1/*: any*/)
  ],
  "type": "Call",
  "abstractKey": null
};
})();

(node as any).hash = "95d9fb93f0ebe83748413d6a9cca709e";

export default node;
