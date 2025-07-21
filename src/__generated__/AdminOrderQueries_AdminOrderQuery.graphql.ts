/**
 * @generated SignedSource<<2e3c8babde34402bfddbf0c1bddd1c9a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AdminOrderQueries_AdminOrderQuery$variables = {
  orderId: string;
};
export type AdminOrderQueries_AdminOrderQuery$data = {
  readonly adminOrder: {
    readonly createdAt: any;
    readonly id: string;
    readonly items: ReadonlyArray<{
      readonly id: string;
      readonly price: number;
      readonly product: {
        readonly category: string;
        readonly description: string;
        readonly id: string;
        readonly name: string;
        readonly photoUrl: string;
        readonly price: number;
        readonly slug: string;
        readonly tags: ReadonlyArray<string>;
      };
      readonly productId: string;
      readonly quantity: number;
    }>;
    readonly status: string;
    readonly stripeSessionId: string | null;
    readonly total: number;
    readonly updatedAt: any;
    readonly user: {
      readonly email: string;
      readonly firstName: string | null;
      readonly id: string;
      readonly lastName: string | null;
    } | null;
    readonly userId: string;
  } | null;
};
export type AdminOrderQueries_AdminOrderQuery = {
  response: AdminOrderQueries_AdminOrderQuery$data;
  variables: AdminOrderQueries_AdminOrderQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "orderId"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "price",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "orderId",
        "variableName": "orderId"
      }
    ],
    "concreteType": "Order",
    "kind": "LinkedField",
    "name": "adminOrder",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "userId",
        "storageKey": null
      },
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
        "kind": "ScalarField",
        "name": "status",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "createdAt",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "updatedAt",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "stripeSessionId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "firstName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "lastName",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "OrderItem",
        "kind": "LinkedField",
        "name": "items",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "productId",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "quantity",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Product",
            "kind": "LinkedField",
            "name": "product",
            "plural": false,
            "selections": [
              (v1/*: any*/),
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
                "name": "slug",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "description",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "photoUrl",
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "category",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "tags",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AdminOrderQueries_AdminOrderQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AdminOrderQueries_AdminOrderQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "fd12aae0da7dff1365e772f5922d4213",
    "id": null,
    "metadata": {},
    "name": "AdminOrderQueries_AdminOrderQuery",
    "operationKind": "query",
    "text": "query AdminOrderQueries_AdminOrderQuery(\n  $orderId: String!\n) {\n  adminOrder(orderId: $orderId) {\n    id\n    userId\n    total\n    status\n    createdAt\n    updatedAt\n    stripeSessionId\n    user {\n      id\n      email\n      firstName\n      lastName\n    }\n    items {\n      id\n      productId\n      quantity\n      price\n      product {\n        id\n        name\n        slug\n        description\n        photoUrl\n        price\n        category\n        tags\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fdb6541cb0b5a18f2f9936b60e87e7c9";

export default node;
