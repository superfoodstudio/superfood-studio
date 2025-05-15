/**
 * @generated SignedSource<<58234a15eaa0d9b4a7e62dbfa85e0b9f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CartQueriesRemoveFromCartMutation$variables = {
  cartItemId: string;
};
export type CartQueriesRemoveFromCartMutation$data = {
  readonly removeFromCart: {
    readonly " $fragmentSpreads": FragmentRefs<"CartQueriesCartDetails_cart">;
  };
};
export type CartQueriesRemoveFromCartMutation = {
  response: CartQueriesRemoveFromCartMutation$data;
  variables: CartQueriesRemoveFromCartMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cartItemId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "cartItemId",
    "variableName": "cartItemId"
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
    "name": "CartQueriesRemoveFromCartMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Cart",
        "kind": "LinkedField",
        "name": "removeFromCart",
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
    "name": "CartQueriesRemoveFromCartMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Cart",
        "kind": "LinkedField",
        "name": "removeFromCart",
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
    "cacheID": "d3766bbb6aa91f3d6c0f473e23f38ac4",
    "id": null,
    "metadata": {},
    "name": "CartQueriesRemoveFromCartMutation",
    "operationKind": "mutation",
    "text": "mutation CartQueriesRemoveFromCartMutation(\n  $cartItemId: ID!\n) {\n  removeFromCart(cartItemId: $cartItemId) {\n    ...CartQueriesCartDetails_cart\n    id\n  }\n}\n\nfragment CartQueriesCartDetails_cart on Cart {\n  id\n  total\n  items {\n    id\n    quantity\n    price\n    product {\n      id\n      name\n      photoUrl\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b4865d8a4ded3f7d4bc004232069a85d";

export default node;
