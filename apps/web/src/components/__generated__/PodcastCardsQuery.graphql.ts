/**
 * @generated SignedSource<<6ab27e935a2224c0b956355207733577>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PodcastCardsQuery$data = {
  readonly podcasts: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"PodcastCard_podcast">;
      };
    } | null>;
  };
  readonly " $fragmentType": "PodcastCardsQuery";
};
export type PodcastCardsQuery$key = {
  readonly " $data"?: PodcastCardsQuery$data;
  readonly " $fragmentSpreads": FragmentRefs<"PodcastCardsQuery">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PodcastCardsQuery",
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
                  "name": "PodcastCard_podcast"
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
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "07b604eee231f52e759b7cd29b96fcac";

export default node;
