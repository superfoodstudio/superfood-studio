/**
 * @generated SignedSource<<a2264b9e5f01e3a704e22d42aaf9da6e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SubscriptionMutationsCancelSubscriptionMutation$variables = {};
export type SubscriptionMutationsCancelSubscriptionMutation$data = {
  readonly cancelSubscription: {
    readonly cancelAtPeriodEnd: boolean;
    readonly currentPeriodEnd: string;
    readonly currentPeriodStart: string;
    readonly id: string;
    readonly plan: string;
    readonly status: string;
    readonly stripeSubscriptionId: string;
  };
};
export type SubscriptionMutationsCancelSubscriptionMutation = {
  response: SubscriptionMutationsCancelSubscriptionMutation$data;
  variables: SubscriptionMutationsCancelSubscriptionMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "UserSubscription",
    "kind": "LinkedField",
    "name": "cancelSubscription",
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SubscriptionMutationsCancelSubscriptionMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SubscriptionMutationsCancelSubscriptionMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "77e662f60a952fc0eaa00ff96b15f808",
    "id": null,
    "metadata": {},
    "name": "SubscriptionMutationsCancelSubscriptionMutation",
    "operationKind": "mutation",
    "text": "mutation SubscriptionMutationsCancelSubscriptionMutation {\n  cancelSubscription {\n    id\n    status\n    plan\n    currentPeriodStart\n    currentPeriodEnd\n    cancelAtPeriodEnd\n    stripeSubscriptionId\n  }\n}\n"
  }
};
})();

(node as any).hash = "9aa14a95a9df2cbd0efbe71e839679ca";

export default node;
