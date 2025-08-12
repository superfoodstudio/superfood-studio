/**
 * @generated SignedSource<<a6c09bdd55cc0d61560c4980226bc8be>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type FeaturedRecipeQueryQuery$variables = {};
export type FeaturedRecipeQueryQuery$data = {
  readonly publicRecipes: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly category: string;
        readonly description: string;
        readonly id: string;
        readonly mediaUrl: string;
        readonly name: string;
        readonly previewImageUrl: string | null;
        readonly slug: string;
        readonly uploadDate: any;
      };
    }>;
  };
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
        "name": "first",
        "value": 1
      }
    ],
    "concreteType": "RecipeConnection",
    "kind": "LinkedField",
    "name": "publicRecipes",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "RecipeEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Recipe",
            "kind": "LinkedField",
            "name": "node",
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
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "publicRecipes(first:1)"
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
    "cacheID": "345432da5178d099800b07f6558ef4bc",
    "id": null,
    "metadata": {},
    "name": "FeaturedRecipeQueryQuery",
    "operationKind": "query",
    "text": "query FeaturedRecipeQueryQuery {\n  publicRecipes(first: 1) {\n    edges {\n      node {\n        id\n        name\n        slug\n        description\n        category\n        mediaUrl\n        previewImageUrl\n        uploadDate\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a4b35b8120ea24967a50738c9da4c3c8";

export default node;
