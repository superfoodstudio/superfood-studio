/**
 * @generated SignedSource<<096fb75a95cf722826208e810e1cd8aa>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type FeaturedRecipeQueryQuery$variables = {};
export type FeaturedRecipeQueryQuery$data = {
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
export type FeaturedRecipeQueryQuery = {
  response: FeaturedRecipeQueryQuery$data;
  variables: FeaturedRecipeQueryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "limit",
        "value": 1
      },
      {
        "kind": "Literal",
        "name": "offset",
        "value": 0
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
    "storageKey": "publicRecipes(limit:1,offset:0)"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "FeaturedRecipeQueryQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "FeaturedRecipeQueryQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "db09d86d8d903982b72f7d8b00f3a616",
    "id": null,
    "metadata": {},
    "name": "FeaturedRecipeQueryQuery",
    "operationKind": "query",
    "text": "query FeaturedRecipeQueryQuery {\n  publicRecipes(limit: 1, offset: 0) {\n    id\n    name\n    slug\n    description\n    category\n    mediaUrl\n    uploadDate\n  }\n}\n"
  }
};
})();

(node as any).hash = "09d99d57c93251a50b2b67d822edd522";

export default node;
