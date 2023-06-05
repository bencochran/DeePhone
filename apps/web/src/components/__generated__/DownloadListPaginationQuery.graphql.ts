/**
 * @generated SignedSource<<b1731447a60675d15519b2cce3341206>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DownloadListPaginationQuery$variables = {
  cursor?: string | null;
  episodeIdentifier: number;
  first?: number | null;
};
export type DownloadListPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"DownloadListQuery">;
};
export type DownloadListPaginationQuery = {
  response: DownloadListPaginationQuery$data;
  variables: DownloadListPaginationQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
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
v1 = {
  "kind": "Variable",
  "name": "first",
  "variableName": "first"
},
v2 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  (v1/*: any*/)
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DownloadListPaginationQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          },
          {
            "kind": "Variable",
            "name": "episodeIdentifier",
            "variableName": "episodeIdentifier"
          },
          (v1/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "DownloadListQuery"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DownloadListPaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "identifier",
            "variableName": "episodeIdentifier"
          }
        ],
        "concreteType": "Episode",
        "kind": "LinkedField",
        "name": "episode",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "EpisodeDownloadsConnection",
            "kind": "LinkedField",
            "name": "downloads",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "EpisodeDownloadsConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "EpisodeDownload",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "identifier",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "downloadDate",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "partCount",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "finished",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "deleted",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "callCount",
                        "storageKey": null
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
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "Episode_downloads",
            "kind": "LinkedHandle",
            "name": "downloads"
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "94cbe5e56dd52cc51f3f848295ca25cb",
    "id": null,
    "metadata": {},
    "name": "DownloadListPaginationQuery",
    "operationKind": "query",
    "text": "query DownloadListPaginationQuery(\n  $cursor: ID\n  $episodeIdentifier: Int!\n  $first: Int\n) {\n  ...DownloadListQuery_2Q8tVP\n}\n\nfragment DownloadListQuery_2Q8tVP on Query {\n  episode(identifier: $episodeIdentifier) {\n    downloads(first: $first, after: $cursor) {\n      edges {\n        node {\n          id\n          ...DownloadRow_episodeDownload\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n    id\n  }\n}\n\nfragment DownloadRow_episodeDownload on EpisodeDownload {\n  identifier\n  downloadDate\n  partCount\n  finished\n  deleted\n  callCount\n}\n"
  }
};
})();

(node as any).hash = "b4c17fcaee7e7dfbf2a8594311ec9ba0";

export default node;
