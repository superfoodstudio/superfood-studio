/**
 * @generated SignedSource<<f4fe05e4d587743154199c0aa0e5d4c6>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type SubscriptionQueriesUserSubscriptionQuery$variables = {};
export type SubscriptionQueriesUserSubscriptionQuery$data = {
  readonly userSubscription: {
    readonly cancelAtPeriodEnd: boolean;
    readonly currentPeriodEnd: string;
    readonly currentPeriodStart: string;
    readonly id: string;
    readonly plan: string;
    readonly status: string;
    readonly stripeSubscriptionId: string;
  } | null;
};
export type SubscriptionQueriesUserSubscriptionQuery = {
  response: SubscriptionQueriesUserSubscriptionQuery$data;
  variables: SubscriptionQueriesUserSubscriptionQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "UserSubscription",
    "kind": "LinkedField",
    "name": "userSubscription",
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
    "name": "SubscriptionQueriesUserSubscriptionQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SubscriptionQueriesUserSubscriptionQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "651b64565209cd890b412dc89d9c9cd5",
    "id": null,
    "metadata": {},
    "name": "SubscriptionQueriesUserSubscriptionQuery",
    "operationKind": "query",
    "text": "query SubscriptionQueriesUserSubscriptionQuery {\n  userSubscription {\n    id\n    status\n    plan\n    currentPeriodStart\n    currentPeriodEnd\n    cancelAtPeriodEnd\n    stripeSubscriptionId\n  }\n}\n"
  }
};
})();

(node as any).hash = "0e8b8fdbbe8853d43dcab183f143f614";

export default node;
