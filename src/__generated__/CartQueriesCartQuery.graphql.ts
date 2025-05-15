/**
 * @generated SignedSource<<46b932401c6a2df29850e427a15b4869>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CartQueriesCartQuery$variables = {};
export type CartQueriesCartQuery$data = {
  readonly cart: {
    readonly " $fragmentSpreads": FragmentRefs<"CartQueriesCartDetails_cart">;
  } | null;
};
export type CartQueriesCartQuery = {
  response: CartQueriesCartQuery$data;
  variables: CartQueriesCartQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CartQueriesCartQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Cart",
        "kind": "LinkedField",
        "name": "cart",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "CartQueriesCartDetails_cart"
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CartQueriesCartQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Cart",
        "kind": "LinkedField",
        "name": "cart",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "total",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "CartItem",
            "kind": "LinkedField",
            "name": "items",
            "plural": true,
            "selections": [
              (v0/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "quantity",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "price",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Product",
                "kind": "LinkedField",
                "name": "product",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "name",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "photoUrl",
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
    ]
  },
  "params": {
    "cacheID": "0292b2279fbcdb9f90e82fecdf94e8f8",
    "id": null,
    "metadata": {},
    "name": "CartQueriesCartQuery",
    "operationKind": "query",
    "text": "query CartQueriesCartQuery {\n  cart {\n    ...CartQueriesCartDetails_cart\n    id\n  }\n}\n\nfragment CartQueriesCartDetails_cart on Cart {\n  id\n  total\n  items {\n    id\n    quantity\n    price\n    product {\n      id\n      name\n      photoUrl\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e74e32c1dee69f0a0a2e9ffa0967b206";

export default node;
