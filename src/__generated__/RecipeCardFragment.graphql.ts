/**
 * @generated SignedSource<<2a28cc5e0c91b8e39b295d83b6b5124c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RecipeCardFragment$data = {
  readonly averageRating: number | null;
  readonly category: string;
  readonly cookTime: number | null;
  readonly description: string;
  readonly id: string;
  readonly mediaUrl: string;
  readonly name: string;
  readonly prepTime: number | null;
  readonly previewImageUrl: string | null;
  readonly servingSize: string | null;
  readonly slug: string;
  readonly totalRatings: number;
  readonly totalTime: number | null;
  readonly uploadDate: any;
  readonly " $fragmentType": "RecipeCardFragment";
};
export type RecipeCardFragment$key = {
  readonly " $data"?: RecipeCardFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"RecipeCardFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RecipeCardFragment",
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
      "name": "servingSize",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "totalTime",
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
      "name": "cookTime",
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
    }
  ],
  "type": "Recipe",
  "abstractKey": null
};

(node as any).hash = "0a20133d486f06792a943dac576e0bcf";

export default node;
