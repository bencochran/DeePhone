/**
 * @generated SignedSource<<e22fe14ed1cf3e8b8f6a96b4c8b2a87e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Podcast_podcast$data = {
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
  readonly " $fragmentType": "Podcast_podcast";
};
export type Podcast_podcast$key = {
  readonly " $data"?: Podcast_podcast$data;
  readonly " $fragmentSpreads": FragmentRefs<"Podcast_podcast">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Podcast_podcast",
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
          "value": 10
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
      "storageKey": "episodes(first:10)"
    }
  ],
  "type": "Podcast",
  "abstractKey": null
};

(node as any).hash = "dcba470e3d407f0a271f9ec35f414f4e";

export default node;
