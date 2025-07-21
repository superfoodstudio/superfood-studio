/**
 * @generated SignedSource<<dc51b037692f861878b8f03141b49ac2>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type MembershipQueriesQuery$variables = {};
export type MembershipQueriesQuery$data = {
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
export type MembershipQueriesQuery = {
  response: MembershipQueriesQuery$data;
  variables: MembershipQueriesQuery$variables;
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
    "name": "MembershipQueriesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MembershipQueriesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "c5bda3a9c68b5b00627d18ca91de3bd9",
    "id": null,
    "metadata": {},
    "name": "MembershipQueriesQuery",
    "operationKind": "query",
    "text": "query MembershipQueriesQuery {\n  userSubscription {\n    id\n    status\n    plan\n    currentPeriodStart\n    currentPeriodEnd\n    cancelAtPeriodEnd\n    stripeSubscriptionId\n  }\n}\n"
  }
};
})();

(node as any).hash = "7d88bdaee5c3a53445ae9721827f4dd7";

export default node;
