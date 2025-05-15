/**
 * @generated SignedSource<<febf1c98be7221dfa7299a70c3f4d4b7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RecipeQueriesRecipeDetail_recipe$data = {
  readonly category: string;
  readonly createdAt: any;
  readonly description: string;
  readonly id: string;
  readonly ingredients: ReadonlyArray<string> | null;
  readonly instructions: ReadonlyArray<string> | null;
  readonly mediaUrl: string;
  readonly name: string;
  readonly slug: string;
  readonly uploadDate: any;
  readonly " $fragmentType": "RecipeQueriesRecipeDetail_recipe";
};
export type RecipeQueriesRecipeDetail_recipe$key = {
  readonly " $data"?: RecipeQueriesRecipeDetail_recipe$data;
  readonly " $fragmentSpreads": FragmentRefs<"RecipeQueriesRecipeDetail_recipe">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RecipeQueriesRecipeDetail_recipe",
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
      "name": "ingredients",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "instructions",
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
      "name": "createdAt",
      "storageKey": null
    }
  ],
  "type": "Recipe",
  "abstractKey": null
};

(node as any).hash = "1dd981baace515dc8eca4679505e5d14";

export default node;
