/**
 * @generated SignedSource<<5973aa492016a5d6a0560bb82893e02f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RecipeQueriesRecipeDetail_recipe$data = {
  readonly averageRating: number | null;
  readonly category: string;
  readonly createdAt: any;
  readonly description: string;
  readonly id: string;
  readonly ingredients: ReadonlyArray<string> | null;
  readonly instructions: ReadonlyArray<string> | null;
  readonly mediaUrl: string;
  readonly name: string;
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
  readonly totalRatings: number;
  readonly uploadDate: any;
  readonly " $fragmentType": "RecipeQueriesRecipeDetail_recipe";
};
export type RecipeQueriesRecipeDetail_recipe$key = {
  readonly " $data"?: RecipeQueriesRecipeDetail_recipe$data;
  readonly " $fragmentSpreads": FragmentRefs<"RecipeQueriesRecipeDetail_recipe">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "RecipeQueriesRecipeDetail_recipe",
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
    (v1/*: any*/),
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
      "concreteType": "RecipeRating",
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
        (v1/*: any*/),
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
  "type": "Recipe",
  "abstractKey": null
};
})();

(node as any).hash = "184ad585719ae1404d5d7c7087538fd4";

export default node;
