/**
 * @generated SignedSource<<cb8e4a7d6651fd220835d6d74e580bac>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ProfileQueriesOrderByPaymentIntentQuery$variables = {
  paymentIntentId: string;
};
export type ProfileQueriesOrderByPaymentIntentQuery$data = {
  readonly orderByPaymentIntent: {
    readonly createdAt: any;
    readonly id: string;
    readonly items: ReadonlyArray<{
      readonly id: string;
      readonly price: number;
      readonly product: {
        readonly name: string;
        readonly photoUrl: string;
      };
      readonly quantity: number;
    }>;
    readonly status: string;
    readonly total: number;
  } | null;
};
export type ProfileQueriesOrderByPaymentIntentQuery = {
  response: ProfileQueriesOrderByPaymentIntentQuery$data;
  variables: ProfileQueriesOrderByPaymentIntentQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "paymentIntentId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "paymentIntentId",
    "variableName": "paymentIntentId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "total",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "quantity",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "price",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "photoUrl",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ProfileQueriesOrderByPaymentIntentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Order",
        "kind": "LinkedField",
        "name": "orderByPaymentIntent",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "OrderItem",
            "kind": "LinkedField",
            "name": "items",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Product",
                "kind": "LinkedField",
                "name": "product",
                "plural": false,
                "selections": [
                  (v8/*: any*/),
                  (v9/*: any*/)
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
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ProfileQueriesOrderByPaymentIntentQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Order",
        "kind": "LinkedField",
        "name": "orderByPaymentIntent",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "OrderItem",
            "kind": "LinkedField",
            "name": "items",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Product",
                "kind": "LinkedField",
                "name": "product",
                "plural": false,
                "selections": [
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
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
    "cacheID": "8c88a4d58ffd7994ce5a796867c0ca58",
    "id": null,
    "metadata": {},
    "name": "ProfileQueriesOrderByPaymentIntentQuery",
    "operationKind": "query",
    "text": "query ProfileQueriesOrderByPaymentIntentQuery(\n  $paymentIntentId: String!\n) {\n  orderByPaymentIntent(paymentIntentId: $paymentIntentId) {\n    id\n    total\n    status\n    createdAt\n    items {\n      id\n      quantity\n      price\n      product {\n        name\n        photoUrl\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "149edae28282f0bade9f202094e5d374";

export default node;
