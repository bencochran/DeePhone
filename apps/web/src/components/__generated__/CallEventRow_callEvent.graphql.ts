/**
 * @generated SignedSource<<23e5d2ac8e280c06b50a9c9726da7695>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type CallEventType = "ANSWERED" | "ENDED" | "ENDING_EPISODE" | "EPISODE_ERROR" | "EPISODE_READY" | "FETCHING_EPISODE" | "INTRODUCING_EPISODE" | "NO_EPISODE" | "PLAYING_EPISODE" | "WAITING_MESSAGE" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type CallEventRow_callEvent$data = {
  readonly date: any;
  readonly download: {
    readonly episode: {
      readonly imageURL: any | null;
      readonly publishDate: any;
      readonly title: string;
    };
    readonly partCount: number;
  } | null;
  readonly part: {
    readonly duration: number;
    readonly number: number;
    readonly size: number;
  } | null;
  readonly type: CallEventType;
  readonly " $fragmentType": "CallEventRow_callEvent";
};
export type CallEventRow_callEvent$key = {
  readonly " $data"?: CallEventRow_callEvent$data;
  readonly " $fragmentSpreads": FragmentRefs<"CallEventRow_callEvent">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CallEventRow_callEvent",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "date",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "type",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "EpisodeDownload",
      "kind": "LinkedField",
      "name": "download",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "partCount",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Episode",
          "kind": "LinkedField",
          "name": "episode",
          "plural": false,
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
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "EpisodePart",
      "kind": "LinkedField",
      "name": "part",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "number",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "size",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "duration",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "CallEvent",
  "abstractKey": null
};

(node as any).hash = "41779538fd6546bdefb692516c1d5f58";

export default node;
