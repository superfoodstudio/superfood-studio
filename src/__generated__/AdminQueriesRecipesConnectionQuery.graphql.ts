/**
 * @generated SignedSource<<2bd832331c0dd2bf05bd3903edec6095>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AdminQueriesRecipesConnectionQuery$variables = {
  after?: string | null;
  category?: string | null;
  first?: number | null;
  search?: string | null;
  sort?: string | null;
  status?: string | null;
};
export type AdminQueriesRecipesConnectionQuery$data = {
  readonly recipesConnection: {
    readonly edges: ReadonlyArray<{
      readonly cursor: string;
      readonly node: {
        readonly category: string;
        readonly comments: ReadonlyArray<{
          readonly id: string;
        }>;
        readonly createdAt: any;
        readonly description: string;
        readonly id: string;
        readonly ingredients: string | null;
        readonly instructions: string | null;
        readonly isPublished: boolean;
        readonly mediaUrl: string;
        readonly name: string;
        readonly previewImageUrl: string | null;
        readonly slug: string;
        readonly updatedAt: any;
        readonly uploadDate: any;
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
export type AdminQueriesRecipesConnectionQuery = {
  response: AdminQueriesRecipesConnectionQuery$data;
  variables: AdminQueriesRecipesConnectionQuery$variables;
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
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v11 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "RecipeEdge",
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
        "concreteType": "Recipe",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v10/*: any*/),
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
            "name": "category",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isPublished",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "mediaUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "previewImageUrl",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "uploadDate",
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
            "name": "ingredients",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "instructions",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Comment",
            "kind": "LinkedField",
            "name": "comments",
            "plural": true,
            "selections": [
              (v10/*: any*/)
            ],
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
v12 = [
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
    "name": "AdminQueriesRecipesConnectionQuery",
    "selections": [
      {
        "alias": "recipesConnection",
        "args": [
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/)
        ],
        "concreteType": "RecipeConnection",
        "kind": "LinkedField",
        "name": "__AdminRecipesList_recipesConnection_connection",
        "plural": false,
        "selections": (v11/*: any*/),
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
    "name": "AdminQueriesRecipesConnectionQuery",
    "selections": [
      {
        "alias": null,
        "args": (v12/*: any*/),
        "concreteType": "RecipeConnection",
        "kind": "LinkedField",
        "name": "recipesConnection",
        "plural": false,
        "selections": (v11/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v12/*: any*/),
        "filters": [
          "category",
          "status",
          "search",
          "sort"
        ],
        "handle": "connection",
        "key": "AdminRecipesList_recipesConnection",
        "kind": "LinkedHandle",
        "name": "recipesConnection"
      }
    ]
  },
  "params": {
    "cacheID": "bf3b65eb93b78ba92e2f7ac83b3b72a4",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": "first",
          "cursor": "after",
          "direction": "forward",
          "path": [
            "recipesConnection"
          ]
        }
      ]
    },
    "name": "AdminQueriesRecipesConnectionQuery",
    "operationKind": "query",
    "text": "query AdminQueriesRecipesConnectionQuery(\n  $first: Int\n  $after: String\n  $category: String\n  $status: String\n  $search: String\n  $sort: String\n) {\n  recipesConnection(first: $first, after: $after, category: $category, status: $status, search: $search, sort: $sort) {\n    edges {\n      cursor\n      node {\n        id\n        name\n        slug\n        description\n        category\n        isPublished\n        mediaUrl\n        previewImageUrl\n        uploadDate\n        createdAt\n        updatedAt\n        ingredients\n        instructions\n        comments {\n          id\n        }\n        __typename\n      }\n    }\n    pageInfo {\n      hasNextPage\n      hasPreviousPage\n      startCursor\n      endCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f600b8a456e7ddb686c5538d0fd6e990";

export default node;
