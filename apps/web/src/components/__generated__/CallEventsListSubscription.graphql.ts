/**
 * @generated SignedSource<<318ff0efb3b2b92fb00f37d8bc151e94>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CallEventsListSubscription$variables = {
  callIdentifier: number;
  connections: ReadonlyArray<string>;
};
export type CallEventsListSubscription$data = {
  readonly callUpdated: {
    readonly newEvents: {
      readonly edges: ReadonlyArray<{
        readonly cursor: string;
        readonly node: {
          readonly id: string;
          readonly " $fragmentSpreads": FragmentRefs<"CallEventRow_callEvent">;
        };
      } | null>;
    };
  };
};
export type CallEventsListSubscription = {
  response: CallEventsListSubscription$data;
  variables: CallEventsListSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "callIdentifier"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "connections"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "callIdentifier",
    "variableName": "callIdentifier"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CallEventsListSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CallUpdatedSubscription",
        "kind": "LinkedField",
        "name": "callUpdated",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "CallEventsConnection",
            "kind": "LinkedField",
            "name": "newEvents",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "CallEventsConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CallEvent",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "CallEventRow_callEvent"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Subscription",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CallEventsListSubscription",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CallUpdatedSubscription",
        "kind": "LinkedField",
        "name": "callUpdated",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "CallEventsConnection",
            "kind": "LinkedField",
            "name": "newEvents",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "CallEventsConnectionEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CallEvent",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v3/*: any*/),
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
                              },
                              (v3/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v3/*: any*/)
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
                          },
                          (v3/*: any*/)
                        ],
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
                "filters": null,
                "handle": "appendEdge",
                "key": "",
                "kind": "LinkedHandle",
                "name": "edges",
                "handleArgs": [
                  {
                    "kind": "Variable",
                    "name": "connections",
                    "variableName": "connections"
                  }
                ]
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "3b772b54826e86c283fbbdbe9671c82c",
    "id": null,
    "metadata": {},
    "name": "CallEventsListSubscription",
    "operationKind": "subscription",
    "text": "subscription CallEventsListSubscription(\n  $callIdentifier: Int!\n) {\n  callUpdated(callIdentifier: $callIdentifier) {\n    newEvents {\n      edges {\n        cursor\n        node {\n          id\n          ...CallEventRow_callEvent\n        }\n      }\n    }\n  }\n}\n\nfragment CallEventRow_callEvent on CallEvent {\n  date\n  type\n  download {\n    partCount\n    episode {\n      title\n      publishDate\n      imageURL\n      id\n    }\n    id\n  }\n  part {\n    number\n    size\n    duration\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "9a2cd10712f6fd3d57d2889cba16cd9c";

export default node;
