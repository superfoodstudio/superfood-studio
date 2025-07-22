/**
 * @generated SignedSource<<c97b337885b7f70b9aeb9a2564209162>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProductQueriesProductDetail_product$data = {
  readonly averageRating: number | null;
  readonly category: string;
  readonly description: string;
  readonly id: string;
  readonly inventory: number;
  readonly name: string;
  readonly photoUrl: string;
  readonly price: number;
  readonly ratings: ReadonlyArray<{
    readonly createdAt: any;
    readonly id: string;
    readonly rating: number;
    readonly user: {
      readonly firstName: string | null;
      readonly id: string;
      readonly lastName: string | null;
    };
  }>;
  readonly slug: string;
  readonly tags: ReadonlyArray<string>;
  readonly totalRatings: number;
  readonly videoUrl: string | null;
  readonly " $fragmentType": "ProductQueriesProductDetail_product";
};
export type ProductQueriesProductDetail_product$key = {
  readonly " $data"?: ProductQueriesProductDetail_product$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProductQueriesProductDetail_product">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProductQueriesProductDetail_product",
  "selections": [
    (v0/*: any*/),
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
        (v0/*: any*/),
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
          "concreteType": "User",
          "kind": "LinkedField",
          "name": "user",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "firstName",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "lastName",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Product",
  "abstractKey": null
};
})();

(node as any).hash = "c5279ab9dd82f643eaeb3263277c9b6e";

export default node;
