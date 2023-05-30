/**
 * @generated SignedSource<<86fd56f25cbf97b565fe99fc0bd9bfb1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type HomeQuery$variables = {};
export type HomeQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"PodcastGrid_podcastsQuery">;
};
export type HomeQuery = {
  response: HomeQuery$data;
  variables: HomeQuery$variables;
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
    "name": "HomeQuery",
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
    "name": "HomeQuery",
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
    "cacheID": "a0924643b36724a2b28ace8b1cfce335",
    "id": null,
    "metadata": {},
    "name": "HomeQuery",
    "operationKind": "query",
    "text": "query HomeQuery {\n  ...PodcastGrid_podcastsQuery\n}\n\nfragment EpisodeRow_episode on Episode {\n  title\n  publishDate\n  imageURL\n  callCount\n}\n\nfragment PodcastCard_podcast on Podcast {\n  title\n  imageURL\n  episodes(first: 4) {\n    edges {\n      node {\n        id\n        title\n        ...EpisodeRow_episode\n      }\n    }\n  }\n}\n\nfragment PodcastGrid_podcastsQuery on Query {\n  podcasts(first: 10) {\n    edges {\n      node {\n        id\n        ...PodcastCard_podcast\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "940803698b4ad7b54368e8378fc667bc";

export default node;
