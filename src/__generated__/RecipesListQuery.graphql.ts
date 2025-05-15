/**
 * @generated SignedSource<<9c806c654b266aae29530d646796c1e8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RecipesListQuery$variables = {
  category?: string | null;
};
export type RecipesListQuery$data = {
  readonly publicRecipes: ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"RecipeCardFragment">;
  }>;
};
export type RecipesListQuery = {
  response: RecipesListQuery$data;
  variables: RecipesListQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "category"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "category",
    "variableName": "category"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RecipesListQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Recipe",
        "kind": "LinkedField",
        "name": "publicRecipes",
        "plural": true,
        "selections": [
          (v2/*: any*/),
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
    "name": "RecipesListQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Recipe",
        "kind": "LinkedField",
        "name": "publicRecipes",
        "plural": true,
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
    "cacheID": "232fe80b7de131fcd77d742d849cff2d",
    "id": null,
    "metadata": {},
    "name": "RecipesListQuery",
    "operationKind": "query",
    "text": "query RecipesListQuery(\n  $category: String\n) {\n  publicRecipes(category: $category) {\n    id\n    ...RecipeCardFragment\n  }\n}\n\nfragment RecipeCardFragment on Recipe {\n  id\n  name\n  slug\n  description\n  category\n  mediaUrl\n  uploadDate\n}\n"
  }
};
})();

(node as any).hash = "729843daae68f430dc3d913c665bf4fc";

export default node;
