/**
 * @generated SignedSource<<ad635054e20fafaa511f0536de9dab8f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type UserQueriesCurrentUserQuery$variables = {};
export type UserQueriesCurrentUserQuery$data = {
  readonly currentUser: {
    readonly createdAt: any;
    readonly email: string;
    readonly firstName: string | null;
    readonly id: string;
    readonly lastName: string | null;
    readonly updatedAt: any;
  } | null;
};
export type UserQueriesCurrentUserQuery = {
  response: UserQueriesCurrentUserQuery$data;
  variables: UserQueriesCurrentUserQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "currentUser",
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
        "name": "email",
        "storageKey": null
      },
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
    "name": "UserQueriesCurrentUserQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "UserQueriesCurrentUserQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "c3acdac83ea96ff2ddef3844deb4368e",
    "id": null,
    "metadata": {},
    "name": "UserQueriesCurrentUserQuery",
    "operationKind": "query",
    "text": "query UserQueriesCurrentUserQuery {\n  currentUser {\n    id\n    email\n    firstName\n    lastName\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "32c88da94228e7140c71f7c5c7dc3455";

export default node;
