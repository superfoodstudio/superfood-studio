/**
 * @generated SignedSource<<2cf575a02a1cf5fe7c6dc2bb8c00c0ba>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RecipeQueriesRecipeDetailBySlugQuery$variables = {
  slug: string;
};
export type RecipeQueriesRecipeDetailBySlugQuery$data = {
  readonly recipeBySlug: {
    readonly " $fragmentSpreads": FragmentRefs<"RecipeQueriesRecipeDetail_recipe">;
  } | null;
};
export type RecipeQueriesRecipeDetailBySlugQuery = {
  response: RecipeQueriesRecipeDetailBySlugQuery$data;
  variables: RecipeQueriesRecipeDetailBySlugQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "slug"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "slug"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RecipeQueriesRecipeDetailBySlugQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Recipe",
        "kind": "LinkedField",
        "name": "recipeBySlug",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "RecipeQueriesRecipeDetail_recipe"
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
    "name": "RecipeQueriesRecipeDetailBySlugQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Recipe",
        "kind": "LinkedField",
        "name": "recipeBySlug",
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "efe5a4989e3f4a1bb3925a9883992879",
    "id": null,
    "metadata": {},
    "name": "RecipeQueriesRecipeDetailBySlugQuery",
    "operationKind": "query",
    "text": "query RecipeQueriesRecipeDetailBySlugQuery(\n  $slug: String!\n) {\n  recipeBySlug(slug: $slug) {\n    ...RecipeQueriesRecipeDetail_recipe\n    id\n  }\n}\n\nfragment RecipeQueriesRecipeDetail_recipe on Recipe {\n  id\n  name\n  slug\n  description\n  category\n  mediaUrl\n  ingredients\n  instructions\n  uploadDate\n  createdAt\n}\n"
  }
};
})();

(node as any).hash = "13aea8421ff8a4352aff4e89607d5d36";

export default node;
