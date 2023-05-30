/**
 * @generated SignedSource<<b6d185760f80431b2a08b3417a3381c6>>
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
        readonly " $fragmentSpreads": FragmentRefs<"Episode_episode">;
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
                  "name": "Episode_episode"
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

(node as any).hash = "85f3def819f9b9102039abed02d416a9";

export default node;
