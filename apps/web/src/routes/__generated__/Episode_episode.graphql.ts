/**
 * @generated SignedSource<<2f971c9b5c3bc60ab4f01d381ede4148>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type Episode_episode$data = {
  readonly callCount: number;
  readonly title: string;
  readonly " $fragmentType": "Episode_episode";
};
export type Episode_episode$key = {
  readonly " $data"?: Episode_episode$data;
  readonly " $fragmentSpreads": FragmentRefs<"Episode_episode">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Episode_episode",
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
      "name": "callCount",
      "storageKey": null
    }
  ],
  "type": "Episode",
  "abstractKey": null
};

(node as any).hash = "0b667938a59c5ebe22f5461ffc6ece76";

export default node;
