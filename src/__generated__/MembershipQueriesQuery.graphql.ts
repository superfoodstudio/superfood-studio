/**
 * @generated SignedSource<<66f8fd45ad95e016727b227919703433>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type MembershipQueriesQuery$variables = {};
export type MembershipQueriesQuery$data = {
  readonly userPaymentMethods: ReadonlyArray<{
    readonly brand: string;
    readonly expMonth: number;
    readonly expYear: number;
    readonly id: string;
    readonly isDefault: boolean;
    readonly last4: string;
  }>;
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
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "UserSubscription",
    "kind": "LinkedField",
    "name": "userSubscription",
    "plural": false,
    "selections": [
      (v0/*: any*/),
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
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "PaymentMethod",
    "kind": "LinkedField",
    "name": "userPaymentMethods",
    "plural": true,
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "brand",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "last4",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "expMonth",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "expYear",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isDefault",
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
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MembershipQueriesQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "aa7a4516a4fc27eed1c52cbd13d95cb8",
    "id": null,
    "metadata": {},
    "name": "MembershipQueriesQuery",
    "operationKind": "query",
    "text": "query MembershipQueriesQuery {\n  userSubscription {\n    id\n    status\n    plan\n    currentPeriodStart\n    currentPeriodEnd\n    cancelAtPeriodEnd\n    stripeSubscriptionId\n  }\n  userPaymentMethods {\n    id\n    brand\n    last4\n    expMonth\n    expYear\n    isDefault\n  }\n}\n"
  }
};
})();

(node as any).hash = "ce485fee64648f6fca7ba3c49469fd10";

export default node;
