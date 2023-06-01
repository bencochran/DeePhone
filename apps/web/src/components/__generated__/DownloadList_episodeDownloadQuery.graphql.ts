/**
 * @generated SignedSource<<6e9f38276a5fb59e1df5a96d46e638c2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type DownloadList_episodeDownloadQuery$data = {
  readonly downloads: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"DownloadRow_episodeDownload">;
      };
    } | null>;
  };
  readonly " $fragmentType": "DownloadList_episodeDownloadQuery";
};
export type DownloadList_episodeDownloadQuery$key = {
  readonly " $data"?: DownloadList_episodeDownloadQuery$data;
  readonly " $fragmentSpreads": FragmentRefs<"DownloadList_episodeDownloadQuery">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "DownloadList_episodeDownloadQuery",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        }
      ],
      "concreteType": "EpisodeDownloadsConnection",
      "kind": "LinkedField",
      "name": "downloads",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "EpisodeDownloadsConnectionEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "EpisodeDownload",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "id",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "DownloadRow_episodeDownload"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "downloads(first:10)"
    }
  ],
  "type": "Episode",
  "abstractKey": null
};

(node as any).hash = "50fe0172b525ae70814c10c995aab0d4";

export default node;
