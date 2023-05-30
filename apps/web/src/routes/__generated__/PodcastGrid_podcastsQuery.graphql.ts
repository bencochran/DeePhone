/**
 * @generated SignedSource<<c0973c63ce9f406055f52f1231cecae2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PodcastGrid_podcastsQuery$data = {
  readonly podcasts: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"PodcastCard_podcast">;
      };
    } | null>;
  };
  readonly " $fragmentType": "PodcastGrid_podcastsQuery";
};
export type PodcastGrid_podcastsQuery$key = {
  readonly " $data"?: PodcastGrid_podcastsQuery$data;
  readonly " $fragmentSpreads": FragmentRefs<"PodcastGrid_podcastsQuery">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PodcastGrid_podcastsQuery",
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

(node as any).hash = "c25f2dc59356dcde89c60f916a92b978";

export default node;
