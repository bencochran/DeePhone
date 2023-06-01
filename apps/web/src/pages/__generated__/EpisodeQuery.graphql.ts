/**
 * @generated SignedSource<<a246235f35b27841b444257cb684e60e>>
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageURL",
  "storageKey": null
},
v4 = {
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
          {
            "alias": null,
            "args": null,
            "concreteType": "Podcast",
            "kind": "LinkedField",
            "name": "podcast",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "publishDate",
            "storageKey": null
          },
          (v3/*: any*/),
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
              {
                "kind": "Literal",
                "name": "first",
                "value": 10
              }
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
                      (v4/*: any*/),
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
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5f453217466eea734d02d905fb1f5391",
    "id": null,
    "metadata": {},
    "name": "EpisodeQuery",
    "operationKind": "query",
    "text": "query EpisodeQuery(\n  $episodeId: Int!\n) {\n  episode(identifier: $episodeId) {\n    podcast {\n      ...PodcastHeader_podcast\n      id\n    }\n    ...EpisodeHeader_episode\n    ...DownloadList_episodeDownloadQuery\n    id\n  }\n}\n\nfragment DownloadList_episodeDownloadQuery on Episode {\n  downloads(first: 10) {\n    edges {\n      node {\n        id\n        ...DownloadRow_episodeDownload\n      }\n    }\n  }\n}\n\nfragment DownloadRow_episodeDownload on EpisodeDownload {\n  downloadDate\n  partCount\n  finished\n  deleted\n  callCount\n}\n\nfragment EpisodeHeader_episode on Episode {\n  title\n  publishDate\n  imageURL\n  description\n}\n\nfragment PodcastHeader_podcast on Podcast {\n  title\n  imageURL\n}\n"
  }
};
})();

(node as any).hash = "213e51ee57cb79dc16c1cbddf091da8e";

export default node;
