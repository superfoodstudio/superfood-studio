/**
 * @generated SignedSource<<cab6dece0dcd97e588b89ad943888996>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ProductsContentCategoriesQuery$variables = {};
export type ProductsContentCategoriesQuery$data = {
  readonly productCategories: ReadonlyArray<string>;
};
export type ProductsContentCategoriesQuery = {
  response: ProductsContentCategoriesQuery$data;
  variables: ProductsContentCategoriesQuery$variables;
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
    "name": "ProductsContentCategoriesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ProductsContentCategoriesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "f333033808bb396f349462e676b5aef3",
    "id": null,
    "metadata": {},
    "name": "ProductsContentCategoriesQuery",
    "operationKind": "query",
    "text": "query ProductsContentCategoriesQuery {\n  productCategories\n}\n"
  }
};
})();

(node as any).hash = "25022b55e3fc18433604d77cad61ea07";

export default node;
