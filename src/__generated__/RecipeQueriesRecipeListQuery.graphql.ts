/**
 * @generated SignedSource<<10003f6c7ea4acf1e0501652b14b7e19>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RecipeQueriesRecipeListQuery$variables = {
  category?: string | null;
  limit?: number | null;
  offset?: number | null;
};
export type RecipeQueriesRecipeListQuery$data = {
  readonly publicRecipes: ReadonlyArray<{
    readonly " $fragmentSpreads": FragmentRefs<"RecipeCardFragment">;
  }>;
};
export type RecipeQueriesRecipeListQuery = {
  response: RecipeQueriesRecipeListQuery$data;
  variables: RecipeQueriesRecipeListQuery$variables;
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
    "name": "RecipeQueriesRecipeListQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Recipe",
        "kind": "LinkedField",
        "name": "publicRecipes",
        "plural": true,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "RecipeCardFragment"
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
    "name": "RecipeQueriesRecipeListQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Recipe",
        "kind": "LinkedField",
        "name": "publicRecipes",
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
            "name": "category",
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
            "name": "uploadDate",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "00203d4af03ce1f8b186cbda72e3c585",
    "id": null,
    "metadata": {},
    "name": "RecipeQueriesRecipeListQuery",
    "operationKind": "query",
    "text": "query RecipeQueriesRecipeListQuery(\n  $category: String\n  $limit: Int\n  $offset: Int\n) {\n  publicRecipes(category: $category, limit: $limit, offset: $offset) {\n    ...RecipeCardFragment\n    id\n  }\n}\n\nfragment RecipeCardFragment on Recipe {\n  id\n  name\n  slug\n  description\n  category\n  mediaUrl\n  uploadDate\n}\n"
  }
};
})();

(node as any).hash = "95037b31fcd60cb3c02ee2d8d0238130";

export default node;
