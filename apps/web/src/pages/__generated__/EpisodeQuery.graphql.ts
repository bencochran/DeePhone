/**
 * @generated SignedSource<<21db02738ad39223eab0a13ada0484b0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EpisodeQuery$variables = {
  episodeId: number;
};
export type EpisodeQuery$data = {
  readonly episode: {
    readonly podcast: {
      readonly " $fragmentSpreads": FragmentRefs<"PodcastHeader_podcast">;
    };
    readonly " $fragmentSpreads": FragmentRefs<"DownloadList_episodeDownloadQuery" | "EpisodeHeader_episode">;
  } | null;
  readonly " $fragmentSpreads": FragmentRefs<"CallListQuery">;
};
export type EpisodeQuery = {
  response: EpisodeQuery$data;
  variables: EpisodeQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "episodeId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "identifier",
    "variableName": "episodeId"
  }
],
v2 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v3 = [
  {
    "kind": "Variable",
    "name": "episodeIdentifier",
    "variableName": "episodeId"
  },
  (v2/*: any*/)
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageURL",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "Podcast",
  "kind": "LinkedField",
  "name": "podcast",
  "plural": false,
  "selections": [
    (v4/*: any*/),
    (v5/*: any*/),
    (v6/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EpisodeQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Episode",
        "kind": "LinkedField",
        "name": "episode",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Podcast",
            "kind": "LinkedField",
            "name": "podcast",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "PodcastHeader_podcast"
              }
            ],
            "storageKey": null
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "EpisodeHeader_episode"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "DownloadList_episodeDownloadQuery"
          }
        ],
        "storageKey": null
      },
      {
        "args": (v3/*: any*/),
        "kind": "FragmentSpread",
        "name": "CallListQuery"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EpisodeQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Episode",
        "kind": "LinkedField",
        "name": "episode",
        "plural": false,
        "selections": [
          (v7/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "publishDate",
            "storageKey": null
          },
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              (v2/*: any*/)
            ],
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
                      (v6/*: any*/),
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
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "downloads(first:10)"
          },
          (v6/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "QueryCallsConnection",
        "kind": "LinkedField",
        "name": "calls",
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
                  (v6/*: any*/),
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
                    "name": "callerName",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "phoneNumber",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "startDate",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endDate",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "status",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Episode",
                    "kind": "LinkedField",
                    "name": "episode",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v7/*: any*/),
                      (v6/*: any*/)
                    ],
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
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
        "filters": [
          "episodeIdentifier"
        ],
        "handle": "connection",
        "key": "Query_calls",
        "kind": "LinkedHandle",
        "name": "calls"
      }
    ]
  },
  "params": {
    "cacheID": "769900fd419b51aa7e6307ab4c71054e",
    "id": null,
    "metadata": {},
    "name": "EpisodeQuery",
    "operationKind": "query",
    "text": "query EpisodeQuery(\n  $episodeId: Int!\n) {\n  episode(identifier: $episodeId) {\n    podcast {\n      ...PodcastHeader_podcast\n      id\n    }\n    ...EpisodeHeader_episode\n    ...DownloadList_episodeDownloadQuery\n    id\n  }\n  ...CallListQuery_2kAcFf\n}\n\nfragment CallListQuery_2kAcFf on Query {\n  calls(first: 10, episodeIdentifier: $episodeId) {\n    edges {\n      node {\n        id\n        identifier\n        ...CallRow_call\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n\nfragment CallRow_call on Call {\n  identifier\n  callerName\n  phoneNumber\n  startDate\n  endDate\n  status\n  episode {\n    title\n    imageURL\n    podcast {\n      title\n      imageURL\n      id\n    }\n    id\n  }\n}\n\nfragment DownloadList_episodeDownloadQuery on Episode {\n  downloads(first: 10) {\n    edges {\n      node {\n        id\n        ...DownloadRow_episodeDownload\n      }\n    }\n  }\n}\n\nfragment DownloadRow_episodeDownload on EpisodeDownload {\n  downloadDate\n  partCount\n  finished\n  deleted\n  callCount\n}\n\nfragment EpisodeHeader_episode on Episode {\n  title\n  publishDate\n  imageURL\n  description\n}\n\nfragment PodcastHeader_podcast on Podcast {\n  title\n  imageURL\n}\n"
  }
};
})();

(node as any).hash = "6b52fa8172f664e1de06e83c440b5be1";

export default node;
