/**
 * @generated SignedSource<<c57e0bfbffad47cca9baf9b8743ed2a6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EpisodeRowSubscription$variables = {
  episodeIdentifier: number;
};
export type EpisodeRowSubscription$data = {
  readonly episodeUpdated: {
    readonly episode: {
      readonly " $fragmentSpreads": FragmentRefs<"EpisodeRow_episode">;
    };
  };
};
export type EpisodeRowSubscription = {
  response: EpisodeRowSubscription$data;
  variables: EpisodeRowSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "episodeIdentifier"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "episodeIdentifier",
    "variableName": "episodeIdentifier"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "EpisodeRowSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EpisodeUpdatedSubscription",
        "kind": "LinkedField",
        "name": "episodeUpdated",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Episode",
            "kind": "LinkedField",
            "name": "episode",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "EpisodeRow_episode"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EpisodeRowSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EpisodeUpdatedSubscription",
        "kind": "LinkedField",
        "name": "episodeUpdated",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Episode",
            "kind": "LinkedField",
            "name": "episode",
            "plural": false,
            "selections": [
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
                "name": "title",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "publishDate",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "imageURL",
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
                "name": "id",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "3718647b19494e6e8c70296b4fcfc690",
    "id": null,
    "metadata": {},
    "name": "EpisodeRowSubscription",
    "operationKind": "subscription",
    "text": "subscription EpisodeRowSubscription(\n  $episodeIdentifier: Int!\n) {\n  episodeUpdated(episodeIdentifier: $episodeIdentifier) {\n    episode {\n      ...EpisodeRow_episode\n      id\n    }\n  }\n}\n\nfragment EpisodeRow_episode on Episode {\n  identifier\n  title\n  publishDate\n  imageURL\n  callCount\n}\n"
  }
};
})();

(node as any).hash = "ce1b04b76e2c0666a33758488c1243b9";

export default node;
