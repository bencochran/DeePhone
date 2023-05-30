/**
 * @generated SignedSource<<3477c49e20b24897f45d62e6e4e165b7>>
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
  readonly imageURL: any | null;
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

(node as any).hash = "547746fe2a9bde60fd3d2076af4d3b90";

export default node;
