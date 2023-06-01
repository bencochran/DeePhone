/**
 * @generated SignedSource<<504b843dda77d8ca05bad727f2da48ba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type EpisodeHeader_episode$data = {
  readonly description: string | null;
  readonly imageURL: any | null;
  readonly publishDate: any;
  readonly title: string;
  readonly " $fragmentType": "EpisodeHeader_episode";
};
export type EpisodeHeader_episode$key = {
  readonly " $data"?: EpisodeHeader_episode$data;
  readonly " $fragmentSpreads": FragmentRefs<"EpisodeHeader_episode">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EpisodeHeader_episode",
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
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "Episode",
  "abstractKey": null
};

(node as any).hash = "9acc1ebcdadf94b10203ddd063ecd01a";

export default node;
