/**
 * @generated SignedSource<<000cd52a23ea0140ecad8060219a32ca>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PodcastCard_podcast$data = {
  readonly episodes: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"EpisodeRow_episode">;
      };
    } | null>;
  };
  readonly imageURL: any | null;
  readonly title: string;
  readonly " $fragmentType": "PodcastCard_podcast";
};
export type PodcastCard_podcast$key = {
  readonly " $data"?: PodcastCard_podcast$data;
  readonly " $fragmentSpreads": FragmentRefs<"PodcastCard_podcast">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PodcastCard_podcast",
  "selections": [
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
      "name": "imageURL",
      "storageKey": null
    },
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

(node as any).hash = "0191ec0612fec3fc94cb8e4cda2ac287";

export default node;
