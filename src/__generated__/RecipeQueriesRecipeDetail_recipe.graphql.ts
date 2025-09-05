/**
 * @generated SignedSource<<00a6c362ed1b27c6b689eac9033ef709>>
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
  readonly cookTime: number | null;
  readonly createdAt: any;
  readonly description: string;
  readonly id: string;
  readonly ingredients: string | null;
  readonly instructions: string | null;
  readonly mediaUrl: string;
  readonly name: string;
  readonly prepTime: number | null;
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
  readonly servingSize: string | null;
  readonly slug: string;
  readonly totalRatings: number;
  readonly totalTime: number | null;
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

(node as any).hash = "370dcd6cc313f2c090898eb2587eff89";

export default node;
