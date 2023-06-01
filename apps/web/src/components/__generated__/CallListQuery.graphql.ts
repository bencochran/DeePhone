/**
 * @generated SignedSource<<4765654be12a9fa0f8cfbe577bdca722>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CallListQuery$data = {
  readonly calls: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly identifier: number;
        readonly " $fragmentSpreads": FragmentRefs<"CallRow_call">;
      };
    } | null>;
    readonly pageInfo: {
      readonly endCursor: string | null;
      readonly hasNextPage: boolean;
    };
  };
  readonly " $fragmentType": "CallListQuery";
};
export type CallListQuery$key = {
  readonly " $data"?: CallListQuery$data;
  readonly " $fragmentSpreads": FragmentRefs<"CallListQuery">;
};

import CallListPaginationQuery_graphql from './CallListPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "calls"
];
return {
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "episodeIdentifier"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
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
      "fragmentPathInResult": [],
      "operation": CallListPaginationQuery_graphql
    }
  },
  "name": "CallListQuery",
  "selections": [
    {
      "alias": "calls",
      "args": [
        {
          "kind": "Variable",
          "name": "episodeIdentifier",
          "variableName": "episodeIdentifier"
        }
      ],
      "concreteType": "QueryCallsConnection",
      "kind": "LinkedField",
      "name": "__Query_calls_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "QueryCallsConnectionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Call",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "identifier",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "CallRow_call"
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
              "name": "hasNextPage",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
})();

(node as any).hash = "275dc3b08e337ee5f4d943f3d960c976";

export default node;
