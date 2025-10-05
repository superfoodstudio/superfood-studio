/**
 * @generated SignedSource<<bf91e051ceb238497bd95bb251fa1585>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UpdateUserInput = {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
};
export type UserQueriesUpdateUserMutation$variables = {
  input: UpdateUserInput;
};
export type UserQueriesUpdateUserMutation$data = {
  readonly updateUser: {
    readonly email: string;
    readonly firstName: string | null;
    readonly id: string;
    readonly lastName: string | null;
    readonly updatedAt: any;
  };
};
export type UserQueriesUpdateUserMutation = {
  response: UserQueriesUpdateUserMutation$data;
  variables: UserQueriesUpdateUserMutation$variables;
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
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "updateUser",
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
        "name": "updatedAt",
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
    "name": "UserQueriesUpdateUserMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UserQueriesUpdateUserMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "cc8a960b16d9546f6a1a62d37a0adac8",
    "id": null,
    "metadata": {},
    "name": "UserQueriesUpdateUserMutation",
    "operationKind": "mutation",
    "text": "mutation UserQueriesUpdateUserMutation(\n  $input: UpdateUserInput!\n) {\n  updateUser(input: $input) {\n    id\n    email\n    firstName\n    lastName\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "a13dc7677c5fc6d4abcb4864d35e8e88";

export default node;
