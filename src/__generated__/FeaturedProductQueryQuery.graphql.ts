/**
 * @generated SignedSource<<0995f8e48913426f7c5ffcce54245d1e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type FeaturedProductQueryQuery$variables = {};
export type FeaturedProductQueryQuery$data = {
  readonly featuredProduct: {
    readonly category: string;
    readonly description: string;
    readonly id: string;
    readonly name: string;
    readonly photoUrl: string;
    readonly price: number;
    readonly slug: string;
  } | null;
};
export type FeaturedProductQueryQuery = {
  response: FeaturedProductQueryQuery$data;
  variables: FeaturedProductQueryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Product",
    "kind": "LinkedField",
    "name": "featuredProduct",
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
        "name": "photoUrl",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "price",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "category",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "FeaturedProductQueryQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "FeaturedProductQueryQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "1c40ee4eb647a324a125ea8e06e90ce0",
    "id": null,
    "metadata": {},
    "name": "FeaturedProductQueryQuery",
    "operationKind": "query",
    "text": "query FeaturedProductQueryQuery {\n  featuredProduct {\n    id\n    name\n    slug\n    description\n    photoUrl\n    price\n    category\n  }\n}\n"
  }
};
})();

(node as any).hash = "d369ec80340b036a1d26ce53d5d6d915";

export default node;
