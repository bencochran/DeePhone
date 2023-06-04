/**
 * @generated SignedSource<<66955dab951e66a28c55f6e6ba11bef8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PodcastsQuery$variables = {};
export type PodcastsQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"PodcastCardsQuery">;
};
export type PodcastsQuery = {
  response: PodcastsQuery$data;
  variables: PodcastsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageURL",
  "storageKey": null
},
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 4
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PodcastsQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "PodcastCardsQuery"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PodcastsQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Literal",
            "name": "first",
            "value": 10
          }
        ],
        "concreteType": "QueryPodcastsConnection",
        "kind": "LinkedField",
        "name": "podcasts",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "QueryPodcastsConnectionEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Podcast",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  (v1/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": (v3/*: any*/),
                    "concreteType": "PodcastEpisodesConnection",
                    "kind": "LinkedField",
                    "name": "episodes",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "PodcastEpisodesConnectionEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Episode",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v0/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "identifier",
                                "storageKey": null
                              },
                              (v1/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "publishDate",
                                "storageKey": null
                              },
                              (v2/*: any*/),
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
                    "storageKey": "episodes(first:4)"
                  },
                  {
                    "alias": null,
                    "args": (v3/*: any*/),
                    "filters": null,
                    "handle": "connection",
                    "key": "EpisodeList_podcast_episodes",
                    "kind": "LinkedHandle",
                    "name": "episodes"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "podcasts(first:10)"
      }
    ]
  },
  "params": {
    "cacheID": "1c993ac9ec721f7ff7d4679bfa2ddc37",
    "id": null,
    "metadata": {},
    "name": "PodcastsQuery",
    "operationKind": "query",
    "text": "query PodcastsQuery {\n  ...PodcastCardsQuery\n}\n\nfragment EpisodeList_podcast_3z2gQm on Podcast {\n  episodes(first: 4) {\n    edges {\n      node {\n        id\n        identifier\n        ...EpisodeRow_episode\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n  id\n}\n\nfragment EpisodeRow_episode on Episode {\n  identifier\n  title\n  publishDate\n  imageURL\n  callCount\n}\n\nfragment PodcastCard_podcast on Podcast {\n  title\n  imageURL\n  ...EpisodeList_podcast_3z2gQm\n}\n\nfragment PodcastCardsQuery on Query {\n  podcasts(first: 10) {\n    edges {\n      node {\n        id\n        ...PodcastCard_podcast\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fbb2a5e22c172c3cedc3865fe40ca53f";

export default node;
