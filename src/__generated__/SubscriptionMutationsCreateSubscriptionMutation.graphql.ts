/**
 * @generated SignedSource<<9b542f25ec4808eb9a37a7b21916a5b6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateSubscriptionInput = {
  paymentMethodId: string;
  priceId: string;
};
export type SubscriptionMutationsCreateSubscriptionMutation$variables = {
  input: CreateSubscriptionInput;
};
export type SubscriptionMutationsCreateSubscriptionMutation$data = {
  readonly createSubscription: {
    readonly cancelAtPeriodEnd: boolean;
    readonly currentPeriodEnd: string;
    readonly currentPeriodStart: string;
    readonly id: string;
    readonly plan: string;
    readonly status: string;
    readonly stripeSubscriptionId: string;
  };
};
export type SubscriptionMutationsCreateSubscriptionMutation = {
  response: SubscriptionMutationsCreateSubscriptionMutation$data;
  variables: SubscriptionMutationsCreateSubscriptionMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UserSubscription",
    "kind": "LinkedField",
    "name": "createSubscription",
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
        "name": "status",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "plan",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "currentPeriodStart",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "currentPeriodEnd",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cancelAtPeriodEnd",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "stripeSubscriptionId",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SubscriptionMutationsCreateSubscriptionMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SubscriptionMutationsCreateSubscriptionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "cca141e8bc728a30729312a45e98811b",
    "id": null,
    "metadata": {},
    "name": "SubscriptionMutationsCreateSubscriptionMutation",
    "operationKind": "mutation",
    "text": "mutation SubscriptionMutationsCreateSubscriptionMutation(\n  $input: CreateSubscriptionInput!\n) {\n  createSubscription(input: $input) {\n    id\n    status\n    plan\n    currentPeriodStart\n    currentPeriodEnd\n    cancelAtPeriodEnd\n    stripeSubscriptionId\n  }\n}\n"
  }
};
})();

(node as any).hash = "09276f39f7d7cac374846bf32e8e26f3";

export default node;
