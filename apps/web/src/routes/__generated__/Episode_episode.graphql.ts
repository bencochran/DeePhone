/**
 * @generated SignedSource<<19d056435bd5c2115cab1396f300bbb1>>
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
  readonly publishDate: any;
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

(node as any).hash = "db24cbc4bb93c3f5c1c2d1fdf7bf4d61";

export default node;
