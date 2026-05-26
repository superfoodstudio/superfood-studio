/**
 * @generated SignedSource<<732a7d2488c16d2e6b4c2373423d3091>>
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
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
};
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
            "name": "servingSize",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "totalTime",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "prepTime",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cookTime",
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
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "averageRating",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "totalRatings",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "RecipeRating",
            "kind": "LinkedField",
            "name": "ratings",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "rating",
                "storageKey": null
              },
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "userId",
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
    "cacheID": "0e83c8d8d8fc5c5f1ca91348beaf1375",
    "id": null,
    "metadata": {},
    "name": "RecipeQueriesRecipeDetailBySlugQuery",
    "operationKind": "query",
    "text": "query RecipeQueriesRecipeDetailBySlugQuery(\n  $slug: String!\n) {\n  recipeBySlug(slug: $slug) {\n    ...RecipeQueriesRecipeDetail_recipe\n    id\n  }\n}\n\nfragment RecipeQueriesRecipeDetail_recipe on Recipe {\n  id\n  name\n  slug\n  description\n  category\n  servingSize\n  totalTime\n  prepTime\n  cookTime\n  mediaUrl\n  previewImageUrl\n  ingredients\n  instructions\n  uploadDate\n  createdAt\n  averageRating\n  totalRatings\n  ratings {\n    id\n    rating\n    createdAt\n    userId\n  }\n}\n"
  }
};
})();

(node as any).hash = "13aea8421ff8a4352aff4e89607d5d36";

export default node;
