/**
 * @generated SignedSource<<877c7a63a0ac73e11504c629b9ba925c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProductQueriesProductsByCategoryQuery$variables = {
  category: string;
  limit?: number | null;
  offset?: number | null;
};
export type ProductQueriesProductsByCategoryQuery$data = {
  readonly productsByCategory: ReadonlyArray<{
    readonly " $fragmentSpreads": FragmentRefs<"ProductCardFragment">;
  }>;
};
export type ProductQueriesProductsByCategoryQuery = {
  response: ProductQueriesProductsByCategoryQuery$data;
  variables: ProductQueriesProductsByCategoryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "category"
  },
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
v1 = [
  {
    "kind": "Variable",
    "name": "category",
    "variableName": "category"
  },
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ProductQueriesProductsByCategoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Product",
        "kind": "LinkedField",
        "name": "productsByCategory",
        "plural": true,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ProductCardFragment"
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
    "name": "ProductQueriesProductsByCategoryQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Product",
        "kind": "LinkedField",
        "name": "productsByCategory",
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "410208c1e05d67d5d3b6000d731fe50d",
    "id": null,
    "metadata": {},
    "name": "ProductQueriesProductsByCategoryQuery",
    "operationKind": "query",
    "text": "query ProductQueriesProductsByCategoryQuery(\n  $category: String!\n  $limit: Int\n  $offset: Int\n) {\n  productsByCategory(category: $category, limit: $limit, offset: $offset) {\n    ...ProductCardFragment\n    id\n  }\n}\n\nfragment ProductCardFragment on Product {\n  id\n  name\n  slug\n  description\n  photoUrl\n  price\n  category\n  tags\n  inventory\n}\n"
  }
};
})();

(node as any).hash = "74ca768461be73a161d1ed08311d55be";

export default node;
