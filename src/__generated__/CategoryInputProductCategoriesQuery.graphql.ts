/**
 * @generated SignedSource<<0b876199acf07ef1fa638f735ea85dec>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type CategoryInputProductCategoriesQuery$variables = {};
export type CategoryInputProductCategoriesQuery$data = {
  readonly productCategories: ReadonlyArray<string>;
};
export type CategoryInputProductCategoriesQuery = {
  response: CategoryInputProductCategoriesQuery$data;
  variables: CategoryInputProductCategoriesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "productCategories",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CategoryInputProductCategoriesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CategoryInputProductCategoriesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "d609be706958e9ba0e3669820eb087ec",
    "id": null,
    "metadata": {},
    "name": "CategoryInputProductCategoriesQuery",
    "operationKind": "query",
    "text": "query CategoryInputProductCategoriesQuery {\n  productCategories\n}\n"
  }
};
})();

(node as any).hash = "d63ae4bd2f51e0ce2a78ec1decc32fb5";

export default node;
