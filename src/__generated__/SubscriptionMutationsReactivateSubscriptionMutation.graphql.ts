/**
 * @generated SignedSource<<53ee9253bcd1352abfb501323956a80b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type SubscriptionMutationsReactivateSubscriptionMutation$variables = {};
export type SubscriptionMutationsReactivateSubscriptionMutation$data = {
  readonly reactivateSubscription: {
    readonly cancelAtPeriodEnd: boolean;
    readonly currentPeriodEnd: string;
    readonly currentPeriodStart: string;
    readonly id: string;
    readonly plan: string;
    readonly status: string;
    readonly stripeSubscriptionId: string;
  };
};
export type SubscriptionMutationsReactivateSubscriptionMutation = {
  response: SubscriptionMutationsReactivateSubscriptionMutation$data;
  variables: SubscriptionMutationsReactivateSubscriptionMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "UserSubscription",
    "kind": "LinkedField",
    "name": "reactivateSubscription",
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
    "name": "SubscriptionMutationsReactivateSubscriptionMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SubscriptionMutationsReactivateSubscriptionMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "22b787d04495e8ea378635e4894e1187",
    "id": null,
    "metadata": {},
    "name": "SubscriptionMutationsReactivateSubscriptionMutation",
    "operationKind": "mutation",
    "text": "mutation SubscriptionMutationsReactivateSubscriptionMutation {\n  reactivateSubscription {\n    id\n    status\n    plan\n    currentPeriodStart\n    currentPeriodEnd\n    cancelAtPeriodEnd\n    stripeSubscriptionId\n  }\n}\n"
  }
};
})();

(node as any).hash = "80cf2ede07b773216292aea600126b56";

export default node;
