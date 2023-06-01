/**
 * @generated SignedSource<<2ac8d5e4197c7b70e58e1ee2416b43df>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PodcastCard_podcast$data = {
  readonly imageURL: any | null;
  readonly title: string;
  readonly " $fragmentSpreads": FragmentRefs<"EpisodeList_podcast">;
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
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 4
        }
      ],
      "kind": "FragmentSpread",
      "name": "EpisodeList_podcast"
    }
  ],
  "type": "Podcast",
  "abstractKey": null
};

(node as any).hash = "b4eb84b7f77833854735c3e103ac5677";

export default node;
