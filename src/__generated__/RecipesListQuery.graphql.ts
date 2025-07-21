/**
 * @generated SignedSource<<cf72fb7ef74357a773d693da0453181f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type RecipesListQuery$variables = {
  category?: string | null;
};
export type RecipesListQuery$data = {
  readonly publicRecipes: ReadonlyArray<{
    readonly category: string;
    readonly description: string;
    readonly id: string;
    readonly mediaUrl: string;
    readonly name: string;
    readonly slug: string;
    readonly uploadDate: any;
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "category",
        "variableName": "category"
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
    "name": "RecipesListQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RecipesListQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "447b131f55762dfee7d8437d2c08ab05",
    "id": null,
    "metadata": {},
    "name": "RecipesListQuery",
    "operationKind": "query",
    "text": "query RecipesListQuery(\n  $category: String\n) {\n  publicRecipes(category: $category) {\n    id\n    name\n    slug\n    description\n    category\n    mediaUrl\n    uploadDate\n  }\n}\n"
  }
};
})();

(node as any).hash = "022c02a7d83ab14e4bb55c744fdc64a5";

export default node;
