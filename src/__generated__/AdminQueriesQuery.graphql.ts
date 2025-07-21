/**
 * @generated SignedSource<<9a5e0e5e7d97d6d2339393f015d86f72>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AdminQueriesQuery$variables = {};
export type AdminQueriesQuery$data = {
  readonly adminMetrics: {
    readonly activeSubscriptions: number;
    readonly pendingOrders: number;
    readonly totalOrders: number;
    readonly totalRevenue: number;
  };
  readonly recentOrders: ReadonlyArray<{
    readonly customerEmail: string;
    readonly customerName: string;
    readonly date: string;
    readonly id: string;
    readonly itemCount: number | null;
    readonly status: string;
    readonly total: number;
  }>;
};
export type AdminQueriesQuery = {
  response: AdminQueriesQuery$data;
  variables: AdminQueriesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "AdminMetrics",
    "kind": "LinkedField",
    "name": "adminMetrics",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalOrders",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalRevenue",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "activeSubscriptions",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "pendingOrders",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "limit",
        "value": 5
      }
    ],
    "concreteType": "AdminOrder",
    "kind": "LinkedField",
    "name": "recentOrders",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
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
        "kind": "ScalarField",
        "name": "itemCount",
        "storageKey": null
      }
    ],
    "storageKey": "recentOrders(limit:5)"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AdminQueriesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AdminQueriesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "62e1b93b85161401af1c7ea7cd37c9bd",
    "id": null,
    "metadata": {},
    "name": "AdminQueriesQuery",
    "operationKind": "query",
    "text": "query AdminQueriesQuery {\n  adminMetrics {\n    totalOrders\n    totalRevenue\n    activeSubscriptions\n    pendingOrders\n  }\n  recentOrders(limit: 5) {\n    id\n    customerName\n    customerEmail\n    total\n    status\n    date\n    itemCount\n  }\n}\n"
  }
};
})();

(node as any).hash = "512cba4ddff7c3d3f51f1401e2276402";

export default node;
