/**
 * @generated SignedSource<<96d0eced11591af5cee3a10f720cf21d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CallRow_call$data = {
  readonly callerName: string | null;
  readonly endDate: any | null;
  readonly episode: {
    readonly imageURL: any | null;
    readonly podcast: {
      readonly imageURL: any | null;
      readonly title: string;
    };
    readonly title: string;
  } | null;
  readonly identifier: number;
  readonly phoneNumber: string;
  readonly startDate: any;
  readonly " $fragmentType": "CallRow_call";
};
export type CallRow_call$key = {
  readonly " $data"?: CallRow_call$data;
  readonly " $fragmentSpreads": FragmentRefs<"CallRow_call">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageURL",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CallRow_call",
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
      "name": "callerName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "phoneNumber",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "startDate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endDate",
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
        (v0/*: any*/),
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Podcast",
          "kind": "LinkedField",
          "name": "podcast",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Call",
  "abstractKey": null
};
})();

(node as any).hash = "01dd3e2e143ef046a446ebbec340c23e";

export default node;
