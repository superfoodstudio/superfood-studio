/**
 * @generated SignedSource<<f5784e26755008b8bb87c209ab4c2f82>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type RecipeQueriesRecipeListQuery$variables = {
  category?: string | null;
  limit?: number | null;
  offset?: number | null;
};
export type RecipeQueriesRecipeListQuery$data = {
  readonly publicRecipes: ReadonlyArray<{
    readonly category: string;
    readonly description: string;
    readonly id: string;
    readonly mediaUrl: string;
    readonly name: string;
    readonly previewImageUrl: string | null;
    readonly slug: string;
    readonly uploadDate: any;
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
    "alias": null,
    "args": [
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
    ],
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
        "name": "previewImageUrl",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RecipeQueriesRecipeListQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RecipeQueriesRecipeListQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "eecf5ab493922153aa21a65fa65d6765",
    "id": null,
    "metadata": {},
    "name": "RecipeQueriesRecipeListQuery",
    "operationKind": "query",
    "text": "query RecipeQueriesRecipeListQuery(\n  $category: String\n  $limit: Int\n  $offset: Int\n) {\n  publicRecipes(category: $category, limit: $limit, offset: $offset) {\n    id\n    name\n    slug\n    description\n    category\n    mediaUrl\n    previewImageUrl\n    uploadDate\n  }\n}\n"
  }
};
})();

(node as any).hash = "697813b019cf97e9898b9ed0a05ee3a3";

export default node;
