/**
 * @generated SignedSource<<8889999bf86c485df5edb772bc2c992d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type root_Query$variables = {};
export type root_Query$data = {
  readonly " $fragmentSpreads": FragmentRefs<"PodcastGrid_podcastsQuery">;
};
export type root_Query = {
  response: root_Query$data;
  variables: root_Query$variables;
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
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "root_Query",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "PodcastGrid_podcastsQuery"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "root_Query",
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
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 4
                      }
                    ],
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
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "episodes(first:4)"
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
    "cacheID": "5776080eccff196f8bc3dcc89d0e9122",
    "id": null,
    "metadata": {},
    "name": "root_Query",
    "operationKind": "query",
    "text": "query root_Query {\n  ...PodcastGrid_podcastsQuery\n}\n\nfragment Episode_episode on Episode {\n  title\n  publishDate\n  imageURL\n  callCount\n}\n\nfragment PodcastCard_podcast on Podcast {\n  title\n  imageURL\n  episodes(first: 4) {\n    edges {\n      node {\n        id\n        ...Episode_episode\n      }\n    }\n  }\n}\n\nfragment PodcastGrid_podcastsQuery on Query {\n  podcasts(first: 10) {\n    edges {\n      node {\n        id\n        ...PodcastCard_podcast\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "96e2dd341eb24a58e37e3a45b3dacd58";

export default node;
