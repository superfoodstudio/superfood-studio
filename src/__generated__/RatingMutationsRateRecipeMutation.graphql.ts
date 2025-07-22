/**
 * @generated SignedSource<<223de95ae07d8b0559776d70108890e1>>
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
    readonly user: {
      readonly firstName: string | null;
      readonly id: string;
      readonly lastName: string | null;
    };
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
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
          (v1/*: any*/),
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
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "user",
            "plural": false,
            "selections": [
              (v1/*: any*/),
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
    ]
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RatingMutationsRateRecipeMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RatingMutationsRateRecipeMutation",
    "selections": (v2/*: any*/)
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

(node as any).hash = "9f0563dc86a850ba72279405634a642e";

export default node;
