/**
 * @generated SignedSource<<619fb2b468d25a9d114e0a468299c62d>>
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
  readonly identifier: number;
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
      "name": "identifier",
      "storageKey": null
    },
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

(node as any).hash = "2475c7a751875bf16ae5a28341f710d0";

export default node;
