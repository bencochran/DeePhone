/**
 * @generated SignedSource<<e7d1ac009c403ad89746b2e841f12a15>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, GraphQLSubscription } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CallRowSubscription$variables = {
  callIdentifier: number;
};
export type CallRowSubscription$data = {
  readonly callUpdated: {
    readonly call: {
      readonly " $fragmentSpreads": FragmentRefs<"CallRow_call">;
    };
  };
};
export type CallRowSubscription = {
  response: CallRowSubscription$data;
  variables: CallRowSubscription$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "callIdentifier"
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
  "name": "title",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageURL",
  "storageKey": null
},
v4 = {
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
    "name": "CallRowSubscription",
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
            "concreteType": "Call",
            "kind": "LinkedField",
            "name": "call",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "CallRow_call"
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
    "name": "CallRowSubscription",
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
            "concreteType": "Call",
            "kind": "LinkedField",
            "name": "call",
            "plural": false,
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
                "kind": "ScalarField",
                "name": "status",
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Podcast",
                    "kind": "LinkedField",
                    "name": "podcast",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              (v4/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "308acb0a2a8cccf517807a601e343a90",
    "id": null,
    "metadata": {},
    "name": "CallRowSubscription",
    "operationKind": "subscription",
    "text": "subscription CallRowSubscription(\n  $callIdentifier: Int!\n) {\n  callUpdated(callIdentifier: $callIdentifier) {\n    call {\n      ...CallRow_call\n      id\n    }\n  }\n}\n\nfragment CallRow_call on Call {\n  identifier\n  callerName\n  phoneNumber\n  startDate\n  endDate\n  status\n  episode {\n    title\n    imageURL\n    podcast {\n      title\n      imageURL\n      id\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "616d1a6e94343ecfd76ad815473e57ba";

export default node;
