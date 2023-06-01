/**
 * @generated SignedSource<<669d3879d1627c034f6e3bed8fb3059c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EpisodeList_podcast$data = {
  readonly episodes: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly identifier: number;
        readonly " $fragmentSpreads": FragmentRefs<"EpisodeRow_episode">;
      };
    } | null>;
  };
  readonly id: string;
  readonly " $fragmentType": "EpisodeList_podcast";
};
export type EpisodeList_podcast$key = {
  readonly " $data"?: EpisodeList_podcast$data;
  readonly " $fragmentSpreads": FragmentRefs<"EpisodeList_podcast">;
};

import EpisodeListPaginationQuery_graphql from './EpisodeListPaginationQuery.graphql';

const node: ReaderFragment = (function(){
var v0 = [
  "episodes"
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
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
      "fragmentPathInResult": [
        "node"
      ],
      "operation": EpisodeListPaginationQuery_graphql,
      "identifierField": "id"
    }
  },
  "name": "EpisodeList_podcast",
  "selections": [
    {
      "alias": "episodes",
      "args": null,
      "concreteType": "PodcastEpisodesConnection",
      "kind": "LinkedField",
      "name": "__EpisodeList_podcast_episodes_connection",
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
                (v1/*: any*/),
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
                  "name": "EpisodeRow_episode"
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
    (v1/*: any*/)
  ],
  "type": "Podcast",
  "abstractKey": null
};
})();

(node as any).hash = "6e6a91b8c9dec954475ce3c9f49121af";

export default node;
