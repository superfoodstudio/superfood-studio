/**
 * @generated SignedSource<<55b98b54398d9a1a5f4ce96a0d6b1fc1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type RateProductInput = {
  productId: string;
  rating: number;
};
export type RatingMutationsRateProductMutation$variables = {
  input: RateProductInput;
};
export type RatingMutationsRateProductMutation$data = {
  readonly rateProduct: {
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
export type RatingMutationsRateProductMutation = {
  response: RatingMutationsRateProductMutation$data;
  variables: RatingMutationsRateProductMutation$variables;
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
        "concreteType": "ProductRating",
        "kind": "LinkedField",
        "name": "rateProduct",
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
    "name": "RatingMutationsRateProductMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RatingMutationsRateProductMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "1db2052762e9d82f8e232ca6acd3690a",
    "id": null,
    "metadata": {},
    "name": "RatingMutationsRateProductMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();

(node as any).hash = "05113113c58494cfba1d03a609774755";

export default node;
