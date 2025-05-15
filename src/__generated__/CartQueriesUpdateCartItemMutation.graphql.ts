/**
 * @generated SignedSource<<dbb4de62e4b3542a0e12bcadc1561f8b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CartQueriesUpdateCartItemMutation$variables = {
  cartItemId: string;
  quantity: number;
};
export type CartQueriesUpdateCartItemMutation$data = {
  readonly updateCartItem: {
    readonly " $fragmentSpreads": FragmentRefs<"CartQueriesCartDetails_cart">;
  };
};
export type CartQueriesUpdateCartItemMutation = {
  response: CartQueriesUpdateCartItemMutation$data;
  variables: CartQueriesUpdateCartItemMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cartItemId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "quantity"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "cartItemId",
    "variableName": "cartItemId"
  },
  {
    "kind": "Variable",
    "name": "quantity",
    "variableName": "quantity"
  }
],
v2 = {
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
    "name": "CartQueriesUpdateCartItemMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Cart",
        "kind": "LinkedField",
        "name": "updateCartItem",
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
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CartQueriesUpdateCartItemMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Cart",
        "kind": "LinkedField",
        "name": "updateCartItem",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
              (v2/*: any*/),
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
                  (v2/*: any*/),
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
    "cacheID": "ecd42a08e569988f04a1a70bf3f73676",
    "id": null,
    "metadata": {},
    "name": "CartQueriesUpdateCartItemMutation",
    "operationKind": "mutation",
    "text": "mutation CartQueriesUpdateCartItemMutation(\n  $cartItemId: ID!\n  $quantity: Int!\n) {\n  updateCartItem(cartItemId: $cartItemId, quantity: $quantity) {\n    ...CartQueriesCartDetails_cart\n    id\n  }\n}\n\nfragment CartQueriesCartDetails_cart on Cart {\n  id\n  total\n  items {\n    id\n    quantity\n    price\n    product {\n      id\n      name\n      photoUrl\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "26893f1627b29c6917f80e2694ae7da5";

export default node;
