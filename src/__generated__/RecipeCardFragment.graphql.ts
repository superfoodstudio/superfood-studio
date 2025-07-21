/**
 * @generated SignedSource<<adba271c364eaed94f63a9744ac900a0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RecipeCardFragment$data = {
  readonly category: string;
  readonly description: string;
  readonly id: string;
  readonly mediaUrl: string;
  readonly name: string;
  readonly previewImageUrl: string | null;
  readonly slug: string;
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
  "type": "Recipe",
  "abstractKey": null
};

(node as any).hash = "734aca77086d06da1b7ba7cc2be506d5";

export default node;
