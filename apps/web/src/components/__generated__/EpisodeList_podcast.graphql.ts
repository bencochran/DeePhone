/**
 * @generated SignedSource<<08936e80eb35dcba82abdb8ab1d4c9f8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
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
  readonly " $fragmentType": "EpisodeList_podcast";
};
export type EpisodeList_podcast$key = {
  readonly " $data"?: EpisodeList_podcast$data;
  readonly " $fragmentSpreads": FragmentRefs<"EpisodeList_podcast">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EpisodeList_podcast",
  "selections": [
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
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
  "type": "Podcast",
  "abstractKey": null
};

(node as any).hash = "31fdfbf750bb33f63b08bd16b4708acb";

export default node;
