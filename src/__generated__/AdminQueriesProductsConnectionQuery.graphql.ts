/**
 * @generated SignedSource<<60647566616cff4af4d7f8d50054f1eb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AdminQueriesProductsConnectionQuery$variables = {
  after?: string | null;
  category?: string | null;
  first?: number | null;
  search?: string | null;
  sort?: string | null;
  status?: string | null;
};
export type AdminQueriesProductsConnectionQuery$data = {
  readonly productsConnection: {
    readonly edges: ReadonlyArray<{
      readonly cursor: string;
      readonly node: {
        readonly category: string;
        readonly createdAt: any;
        readonly description: string;
        readonly id: string;
        readonly inventory: number;
        readonly isActive: boolean;
        readonly name: string;
        readonly photoUrl: string;
        readonly price: number;
        readonly slug: string;
        readonly tags: ReadonlyArray<string>;
        readonly updatedAt: any;
        readonly videoUrl: string | null;
      };
    }>;
    readonly pageInfo: {
      readonly endCursor: string | null;
      readonly hasNextPage: boolean;
      readonly hasPreviousPage: boolean;
      readonly startCursor: string | null;
    };
  };
};
export type AdminQueriesProductsConnectionQuery = {
  response: AdminQueriesProductsConnectionQuery$data;
  variables: AdminQueriesProductsConnectionQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "category"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "search"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "sort"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "status"
},
v6 = {
  "kind": "Variable",
  "name": "category",
  "variableName": "category"
},
v7 = {
  "kind": "Variable",
  "name": "search",
  "variableName": "search"
},
v8 = {
  "kind": "Variable",
  "name": "sort",
  "variableName": "sort"
},
v9 = {
  "kind": "Variable",
  "name": "status",
  "variableName": "status"
},
v10 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ProductEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cursor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Product",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "videoUrl",
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
            "name": "category",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "tags",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "inventory",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isActive",
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
            "name": "__typename",
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
    "concreteType": "PageInfo",
    "kind": "LinkedField",
    "name": "pageInfo",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "hasNextPage",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "hasPreviousPage",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "startCursor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endCursor",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v11 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  (v6/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  },
  (v7/*: any*/),
  (v8/*: any*/),
  (v9/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AdminQueriesProductsConnectionQuery",
    "selections": [
      {
        "alias": "productsConnection",
        "args": [
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/)
        ],
        "concreteType": "ProductConnection",
        "kind": "LinkedField",
        "name": "__AdminProductsList_productsConnection_connection",
        "plural": false,
        "selections": (v10/*: any*/),
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/),
      (v5/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Operation",
    "name": "AdminQueriesProductsConnectionQuery",
    "selections": [
      {
        "alias": null,
        "args": (v11/*: any*/),
        "concreteType": "ProductConnection",
        "kind": "LinkedField",
        "name": "productsConnection",
        "plural": false,
        "selections": (v10/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v11/*: any*/),
        "filters": [
          "category",
          "status",
          "search",
          "sort"
        ],
        "handle": "connection",
        "key": "AdminProductsList_productsConnection",
        "kind": "LinkedHandle",
        "name": "productsConnection"
      }
    ]
  },
  "params": {
    "cacheID": "164bfac7f331b45628ebf9a6e897f406",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": "first",
          "cursor": "after",
          "direction": "forward",
          "path": [
            "productsConnection"
          ]
        }
      ]
    },
    "name": "AdminQueriesProductsConnectionQuery",
    "operationKind": "query",
    "text": "query AdminQueriesProductsConnectionQuery(\n  $first: Int\n  $after: String\n  $category: String\n  $status: String\n  $search: String\n  $sort: String\n) {\n  productsConnection(first: $first, after: $after, category: $category, status: $status, search: $search, sort: $sort) {\n    edges {\n      cursor\n      node {\n        id\n        name\n        slug\n        description\n        photoUrl\n        videoUrl\n        price\n        category\n        tags\n        inventory\n        isActive\n        createdAt\n        updatedAt\n        __typename\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c7625d9c91fdcf2eb85d50be46f51da0";

export default node;
