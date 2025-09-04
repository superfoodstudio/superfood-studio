/**
 * @generated SignedSource<<661572e9c0f1af3c2401d07d0db01ef9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type CategoryInputRecipeCategoriesQuery$variables = {};
export type CategoryInputRecipeCategoriesQuery$data = {
  readonly recipeCategories: ReadonlyArray<string>;
};
export type CategoryInputRecipeCategoriesQuery = {
  response: CategoryInputRecipeCategoriesQuery$data;
  variables: CategoryInputRecipeCategoriesQuery$variables;
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
    "name": "CategoryInputRecipeCategoriesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CategoryInputRecipeCategoriesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "ea324d731054f6c91239ca0865a8ffca",
    "id": null,
    "metadata": {},
    "name": "CategoryInputRecipeCategoriesQuery",
    "operationKind": "query",
    "text": "query CategoryInputRecipeCategoriesQuery {\n  recipeCategories\n}\n"
  }
};
})();

(node as any).hash = "bb5db5f61f11af15154def61287a6acf";

export default node;
