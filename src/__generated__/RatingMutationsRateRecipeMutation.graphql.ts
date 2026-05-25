/**
 * @generated SignedSource<<23ce275b6ca8a63a0fc895896fcdb4b3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type RateRecipeInput = {
  rating: number;
  recipeId: string;
};
export type RatingMutationsRateRecipeMutation$variables = {
  input: RateRecipeInput;
};
export type RatingMutationsRateRecipeMutation$data = {
  readonly rateRecipe: {
    readonly createdAt: any;
    readonly id: string;
    readonly rating: number;
    readonly updatedAt: any;
    readonly userId: string;
  };
};
export type RatingMutationsRateRecipeMutation = {
  response: RatingMutationsRateRecipeMutation$data;
  variables: RatingMutationsRateRecipeMutation$variables;
};

const node: ClientRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "ClientExtension",
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input"
          }
        ],
        "concreteType": "RecipeRating",
        "kind": "LinkedField",
        "name": "rateRecipe",
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
            "name": "updatedAt",
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
    ]
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RatingMutationsRateRecipeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RatingMutationsRateRecipeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ad4c4b536b1832d6eb166ebd8bb0494b",
    "id": null,
    "metadata": {},
    "name": "RatingMutationsRateRecipeMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "fd185b6c6d67103f2ad3667fe3a0f59d";

export default node;
