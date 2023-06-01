/**
 * @generated SignedSource<<33433451ebf5f0da730e8af36b9e288f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type PodcastHeader_podcast$data = {
  readonly imageURL: any | null;
  readonly title: string;
  readonly " $fragmentType": "PodcastHeader_podcast";
};
export type PodcastHeader_podcast$key = {
  readonly " $data"?: PodcastHeader_podcast$data;
  readonly " $fragmentSpreads": FragmentRefs<"PodcastHeader_podcast">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "PodcastHeader_podcast",
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
    }
  ],
  "type": "Podcast",
  "abstractKey": null
};

(node as any).hash = "addc1309f1a4366786530062f3a07f0d";

export default node;
