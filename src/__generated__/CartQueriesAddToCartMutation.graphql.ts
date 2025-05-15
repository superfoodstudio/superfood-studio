/**
 * @generated SignedSource<<17976aa10109e5eb59718ca507803703>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type AddToCartInput = {
  productId: string;
  quantity: number;
};
export type CartQueriesAddToCartMutation$variables = {
  input: AddToCartInput;
};
export type CartQueriesAddToCartMutation$data = {
  readonly addToCart: {
    readonly " $fragmentSpreads": FragmentRefs<"CartQueriesCartDetails_cart">;
  };
};
export type CartQueriesAddToCartMutation = {
  response: CartQueriesAddToCartMutation$data;
  variables: CartQueriesAddToCartMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
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
    "name": "CartQueriesAddToCartMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Cart",
        "kind": "LinkedField",
        "name": "addToCart",
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
    "name": "CartQueriesAddToCartMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Cart",
        "kind": "LinkedField",
        "name": "addToCart",
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
    "cacheID": "470adc095c81973e251276cd273d7ff5",
    "id": null,
    "metadata": {},
    "name": "CartQueriesAddToCartMutation",
    "operationKind": "mutation",
    "text": "mutation CartQueriesAddToCartMutation(\n  $input: AddToCartInput!\n) {\n  addToCart(input: $input) {\n    ...CartQueriesCartDetails_cart\n    id\n  }\n}\n\nfragment CartQueriesCartDetails_cart on Cart {\n  id\n  total\n  items {\n    id\n    quantity\n    price\n    product {\n      id\n      name\n      photoUrl\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "b9722c2405487e624ab21623ed4370d4";

export default node;
