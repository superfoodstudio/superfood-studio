/**
 * @generated SignedSource<<0a86756f4741fc7798148c3b662eae60>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RecipeQueriesRecipeDetailQuery$variables = {
  id: string;
};
export type RecipeQueriesRecipeDetailQuery$data = {
  readonly recipe: {
    readonly " $fragmentSpreads": FragmentRefs<"RecipeQueriesRecipeDetail_recipe">;
  } | null;
};
export type RecipeQueriesRecipeDetailQuery = {
  response: RecipeQueriesRecipeDetailQuery$data;
  variables: RecipeQueriesRecipeDetailQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RecipeQueriesRecipeDetailQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Recipe",
        "kind": "LinkedField",
        "name": "recipe",
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
    "name": "RecipeQueriesRecipeDetailQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Recipe",
        "kind": "LinkedField",
        "name": "recipe",
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
    "cacheID": "26541d2ec2ba7a9f3646ebe218dd5334",
    "id": null,
    "metadata": {},
    "name": "RecipeQueriesRecipeDetailQuery",
    "operationKind": "query",
    "text": "query RecipeQueriesRecipeDetailQuery(\n  $id: ID!\n) {\n  recipe(id: $id) {\n    ...RecipeQueriesRecipeDetail_recipe\n    id\n  }\n}\n\nfragment RecipeQueriesRecipeDetail_recipe on Recipe {\n  id\n  name\n  slug\n  description\n  category\n  mediaUrl\n  ingredients\n  instructions\n  uploadDate\n  createdAt\n}\n"
  }
};
})();

(node as any).hash = "144c110592de009ed703ca23e90e5b5e";

export default node;
