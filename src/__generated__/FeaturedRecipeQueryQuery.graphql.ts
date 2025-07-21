/**
 * @generated SignedSource<<4c1529bcd34a8f8741cdcb46fbcd0dd5>>
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
    readonly previewImageUrl: string | null;
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
        "name": "previewImageUrl",
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
    "cacheID": "982e7af92a55490cb4fb76ddb3cbc5b1",
    "id": null,
    "metadata": {},
    "name": "FeaturedRecipeQueryQuery",
    "operationKind": "query",
    "text": "query FeaturedRecipeQueryQuery {\n  publicRecipes(limit: 1, offset: 0) {\n    id\n    name\n    slug\n    description\n    category\n    mediaUrl\n    previewImageUrl\n    uploadDate\n  }\n}\n"
  }
};
})();

(node as any).hash = "ea126e0910c558ce88d570f62b9fb9c4";

export default node;
