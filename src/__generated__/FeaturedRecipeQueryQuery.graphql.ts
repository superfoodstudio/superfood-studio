/**
 * @generated SignedSource<<e6b8149f1fee3bfde8feb5c312bc0aa6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type FeaturedRecipeQueryQuery$variables = {};
export type FeaturedRecipeQueryQuery$data = {
  readonly featuredRecipe: {
    readonly averageRating: number | null;
    readonly category: string;
    readonly cookTime: number | null;
    readonly description: string;
    readonly id: string;
    readonly mediaUrl: string;
    readonly name: string;
    readonly prepTime: number | null;
    readonly previewImageUrl: string | null;
    readonly slug: string;
    readonly totalRatings: number;
    readonly totalTime: number | null;
    readonly uploadDate: any;
  } | null;
};
export type FeaturedRecipeQueryQuery = {
  response: FeaturedRecipeQueryQuery$data;
  variables: FeaturedRecipeQueryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Recipe",
    "kind": "LinkedField",
    "name": "featuredRecipe",
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
        "name": "previewImageUrl",
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
        "name": "averageRating",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalRatings",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cookTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "prepTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalTime",
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
    "cacheID": "6010eb531610b9cf109ebeb7a3192314",
    "id": null,
    "metadata": {},
    "name": "FeaturedRecipeQueryQuery",
    "operationKind": "query",
    "text": "query FeaturedRecipeQueryQuery {\n  featuredRecipe {\n    id\n    name\n    slug\n    description\n    category\n    mediaUrl\n    previewImageUrl\n    uploadDate\n    averageRating\n    totalRatings\n    cookTime\n    prepTime\n    totalTime\n  }\n}\n"
  }
};
})();

(node as any).hash = "2f4e1a751afc2a0bab0854bc00d42330";

export default node;
