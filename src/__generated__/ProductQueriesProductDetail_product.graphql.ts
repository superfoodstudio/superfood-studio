/**
 * @generated SignedSource<<352063b134cdafc6b19560d96e309243>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ProductQueriesProductDetail_product$data = {
  readonly category: string;
  readonly description: string;
  readonly id: string;
  readonly inventory: number;
  readonly name: string;
  readonly photoUrl: string;
  readonly price: number;
  readonly slug: string;
  readonly tags: ReadonlyArray<string>;
  readonly videoUrl: string | null;
  readonly " $fragmentType": "ProductQueriesProductDetail_product";
};
export type ProductQueriesProductDetail_product$key = {
  readonly " $data"?: ProductQueriesProductDetail_product$data;
  readonly " $fragmentSpreads": FragmentRefs<"ProductQueriesProductDetail_product">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProductQueriesProductDetail_product",
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
    }
  ],
  "type": "Product",
  "abstractKey": null
};

(node as any).hash = "3ac7158581379653b379c4d8d6e5bd27";

export default node;
