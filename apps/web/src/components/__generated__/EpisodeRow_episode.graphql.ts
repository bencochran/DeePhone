/**
 * @generated SignedSource<<7c6fcc70c3091a765d17a0cb354f4372>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EpisodeRow_episode$data = {
  readonly callCount: number;
  readonly imageURL: any | null;
  readonly publishDate: any;
  readonly title: string;
  readonly " $fragmentType": "EpisodeRow_episode";
};
export type EpisodeRow_episode$key = {
  readonly " $data"?: EpisodeRow_episode$data;
  readonly " $fragmentSpreads": FragmentRefs<"EpisodeRow_episode">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EpisodeRow_episode",
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
      "name": "publishDate",
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
      "args": null,
      "kind": "ScalarField",
      "name": "callCount",
      "storageKey": null
    }
  ],
  "type": "Episode",
  "abstractKey": null
};

(node as any).hash = "58525de5c706a06f6bb4cedd5e82bf49";

export default node;
