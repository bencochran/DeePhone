/**
 * @generated SignedSource<<7deb523144e700730202bb841fec08ec>>
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "EpisodeList_podcast"
    }
  ],
  "type": "Podcast",
  "abstractKey": null
};

(node as any).hash = "a20619e726357a152429bbe60a170bb0";

export default node;
