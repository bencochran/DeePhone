/**
 * @generated SignedSource<<2e125d9174bd3d438508dfac8d6dc9a3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DownloadRow_episodeDownload$data = {
  readonly callCount: number;
  readonly deleted: boolean;
  readonly downloadDate: any;
  readonly finished: boolean;
  readonly identifier: number;
  readonly partCount: number;
  readonly " $fragmentType": "DownloadRow_episodeDownload";
};
export type DownloadRow_episodeDownload$key = {
  readonly " $data"?: DownloadRow_episodeDownload$data;
  readonly " $fragmentSpreads": FragmentRefs<"DownloadRow_episodeDownload">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DownloadRow_episodeDownload",
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
      "name": "downloadDate",
      "storageKey": null
    },
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
      "kind": "ScalarField",
      "name": "finished",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "deleted",
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
  "type": "EpisodeDownload",
  "abstractKey": null
};

(node as any).hash = "ac2ab046da01f457fc6defcf7a95a902";

export default node;
