/**
 * @generated SignedSource<<34eadc9de22503673ea4a4ea4185f242>>
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
    readonly userId: string;
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
        "concreteType": "ProductRating",
        "kind": "LinkedField",
        "name": "rateProduct",
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
    "name": "RatingMutationsRateProductMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RatingMutationsRateProductMutation",
    "selections": (v1/*: any*/)
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

(node as any).hash = "6d1355ac0d12971b165411b93eb3d115";

export default node;
