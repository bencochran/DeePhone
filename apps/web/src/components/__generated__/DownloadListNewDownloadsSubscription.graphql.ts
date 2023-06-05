/**
 * @generated SignedSource<<d5d0c1e75fdc51a84cb876ae775a2927>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DownloadListNewDownloadsSubscription$variables = {
  connections: ReadonlyArray<string>;
  episodeIdentifier?: number | null;
};
export type DownloadListNewDownloadsSubscription$data = {
  readonly newEpisodeDownlaods: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly " $fragmentSpreads": FragmentRefs<"DownloadRow_episodeDownload">;
      };
    }>;
  };
};
export type DownloadListNewDownloadsSubscription = {
  response: DownloadListNewDownloadsSubscription$data;
  variables: DownloadListNewDownloadsSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "episodeIdentifier"
},
v2 = [
  {
    "kind": "Variable",
    "name": "episodeIdentifier",
    "variableName": "episodeIdentifier"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "DownloadListNewDownloadsSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "NewEpisodeDownloadsConnection",
        "kind": "LinkedField",
        "name": "newEpisodeDownlaods",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "NewEpisodeDownloadsConnectionEdge",
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
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "DownloadListNewDownloadsSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "NewEpisodeDownloadsConnection",
        "kind": "LinkedField",
        "name": "newEpisodeDownlaods",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "NewEpisodeDownloadsConnectionEdge",
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
          },
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependEdge",
            "key": "",
            "kind": "LinkedHandle",
            "name": "edges",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "abb081dd3a9023d529c6e1c88e4cf3f7",
    "id": null,
    "metadata": {},
    "name": "DownloadListNewDownloadsSubscription",
    "operationKind": "subscription",
    "text": "subscription DownloadListNewDownloadsSubscription(\n  $episodeIdentifier: Int\n) {\n  newEpisodeDownlaods(episodeIdentifier: $episodeIdentifier) {\n    edges {\n      node {\n        ...DownloadRow_episodeDownload\n        id\n      }\n    }\n  }\n}\n\nfragment DownloadRow_episodeDownload on EpisodeDownload {\n  identifier\n  downloadDate\n  partCount\n  finished\n  deleted\n  callCount\n}\n"
  }
};
})();

(node as any).hash = "7f61e1e0777cd638f7702efb156e7407";

export default node;
