/**
 * @generated SignedSource<<2bcc3c2dd299c14586e9ce535e5ddc09>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type AllRecipesSectionCategoriesQuery$variables = {};
export type AllRecipesSectionCategoriesQuery$data = {
  readonly recipeCategories: ReadonlyArray<string>;
};
export type AllRecipesSectionCategoriesQuery = {
  response: AllRecipesSectionCategoriesQuery$data;
  variables: AllRecipesSectionCategoriesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "recipeCategories",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "AllRecipesSectionCategoriesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "AllRecipesSectionCategoriesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "d63f771c6e43a58fa3ea81adbb13152b",
    "id": null,
    "metadata": {},
    "name": "AllRecipesSectionCategoriesQuery",
    "operationKind": "query",
    "text": "query AllRecipesSectionCategoriesQuery {\n  recipeCategories\n}\n"
  }
};
})();

(node as any).hash = "710269f3332dca47781e1e5eb19722d6";

export default node;
