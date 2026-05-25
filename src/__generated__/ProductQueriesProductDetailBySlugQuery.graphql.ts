/**
 * @generated SignedSource<<6c3a3bac2424e6508ab6226f17825a33>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProductQueriesProductDetailBySlugQuery$variables = {
  slug: string;
};
export type ProductQueriesProductDetailBySlugQuery$data = {
  readonly productBySlug: {
    readonly " $fragmentSpreads": FragmentRefs<"ProductQueriesProductDetail_product">;
  } | null;
};
export type ProductQueriesProductDetailBySlugQuery = {
  response: ProductQueriesProductDetailBySlugQuery$data;
  variables: ProductQueriesProductDetailBySlugQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "slug"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "slug",
    "variableName": "slug"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ProductQueriesProductDetailBySlugQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Product",
        "kind": "LinkedField",
        "name": "productBySlug",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ProductQueriesProductDetail_product"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ProductQueriesProductDetailBySlugQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Product",
        "kind": "LinkedField",
        "name": "productBySlug",
        "plural": false,
        "selections": [
          (v2/*: any*/),
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
            "name": "videoUrl",
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
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "tags",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "inventory",
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
            "concreteType": "ProductRating",
            "kind": "LinkedField",
            "name": "ratings",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "rating",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "createdAt",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "userId",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d2f2d6425a1dd1d36d8fce72c9820832",
    "id": null,
    "metadata": {},
    "name": "ProductQueriesProductDetailBySlugQuery",
    "operationKind": "query",
    "text": "query ProductQueriesProductDetailBySlugQuery(\n  $slug: String!\n) {\n  productBySlug(slug: $slug) {\n    ...ProductQueriesProductDetail_product\n    id\n  }\n}\n\nfragment ProductQueriesProductDetail_product on Product {\n  id\n  name\n  slug\n  description\n  photoUrl\n  videoUrl\n  price\n  category\n  tags\n  inventory\n  averageRating\n  totalRatings\n  ratings {\n    id\n    rating\n    createdAt\n    userId\n  }\n}\n"
  }
};
})();

(node as any).hash = "abaaad7f15c85dc2a2186490b632f9b1";

export default node;
