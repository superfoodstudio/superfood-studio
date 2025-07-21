/**
 * @generated SignedSource<<1d90209db1817df65e9468ecf0895508>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AdminQueriesOrdersQuery$variables = {
  limit?: number | null;
  offset?: number | null;
};
export type AdminQueriesOrdersQuery$data = {
  readonly adminOrders: ReadonlyArray<{
    readonly customerEmail: string;
    readonly customerName: string;
    readonly date: string;
    readonly id: string;
    readonly items: ReadonlyArray<{
      readonly id: string;
      readonly photoUrl: string | null;
      readonly price: number;
      readonly productName: string;
      readonly quantity: number;
    }> | null;
    readonly status: string;
    readonly total: number;
  }>;
};
export type AdminQueriesOrdersQuery = {
  response: AdminQueriesOrdersQuery$data;
  variables: AdminQueriesOrdersQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "limit"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "offset"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "limit",
        "variableName": "limit"
      },
      {
        "kind": "Variable",
        "name": "offset",
        "variableName": "offset"
      }
    ],
    "concreteType": "AdminOrder",
    "kind": "LinkedField",
    "name": "adminOrders",
    "plural": true,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "customerName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "customerEmail",
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
        "name": "date",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "AdminOrderItem",
        "kind": "LinkedField",
        "name": "items",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "productName",
            "storageKey": null
          },
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AdminQueriesOrdersQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AdminQueriesOrdersQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "ecf996da3c6d4f863b1474903a195740",
    "id": null,
    "metadata": {},
    "name": "AdminQueriesOrdersQuery",
    "operationKind": "query",
    "text": "query AdminQueriesOrdersQuery(\n  $limit: Int\n  $offset: Int\n) {\n  adminOrders(limit: $limit, offset: $offset) {\n    id\n    customerName\n    customerEmail\n    total\n    status\n    date\n    items {\n      id\n      productName\n      quantity\n      price\n      photoUrl\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c7dac9daf11bcb45f98a72036303da74";

export default node;
