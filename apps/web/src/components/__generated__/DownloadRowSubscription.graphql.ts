/**
 * @generated SignedSource<<8f2250ea9860e2a04a3db4bc2cacf418>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DownloadRowSubscription$variables = {
  episodeDownloadIdentifier: number;
};
export type DownloadRowSubscription$data = {
  readonly episodeDownloadUpdated: {
    readonly download: {
      readonly " $fragmentSpreads": FragmentRefs<"DownloadRow_episodeDownload">;
    };
  };
};
export type DownloadRowSubscription = {
  response: DownloadRowSubscription$data;
  variables: DownloadRowSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "episodeDownloadIdentifier"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "episodeDownloadIdentifier",
    "variableName": "episodeDownloadIdentifier"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DownloadRowSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EpisodeDownloadUpdatedSubscription",
        "kind": "LinkedField",
        "name": "episodeDownloadUpdated",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "EpisodeDownload",
            "kind": "LinkedField",
            "name": "download",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "DownloadRow_episodeDownload"
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
    "name": "DownloadRowSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "EpisodeDownloadUpdatedSubscription",
        "kind": "LinkedField",
        "name": "episodeDownloadUpdated",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "EpisodeDownload",
            "kind": "LinkedField",
            "name": "download",
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
    "cacheID": "1aa8a208e4b93574e4acf4beae317479",
    "id": null,
    "metadata": {},
    "name": "DownloadRowSubscription",
    "operationKind": "subscription",
    "text": "subscription DownloadRowSubscription(\n  $episodeDownloadIdentifier: Int!\n) {\n  episodeDownloadUpdated(episodeDownloadIdentifier: $episodeDownloadIdentifier) {\n    download {\n      ...DownloadRow_episodeDownload\n      id\n    }\n  }\n}\n\nfragment DownloadRow_episodeDownload on EpisodeDownload {\n  identifier\n  downloadDate\n  partCount\n  finished\n  deleted\n  callCount\n}\n"
  }
};
})();

(node as any).hash = "50dcf99e9d28eb43e14ecfafd1c40148";

export default node;
