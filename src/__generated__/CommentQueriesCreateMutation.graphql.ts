/**
 * @generated SignedSource<<8d7453f6f44f419e3b279ac3142ca234>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CreateCommentInput = {
  author: string;
  content: string;
  email?: string | null;
  recipeId: string;
};
export type CommentQueriesCreateMutation$variables = {
  input: CreateCommentInput;
};
export type CommentQueriesCreateMutation$data = {
  readonly createComment: {
    readonly author: string;
    readonly content: string;
    readonly createdAt: any;
    readonly email: string | null;
    readonly id: string;
    readonly isHidden: boolean;
  };
};
export type CommentQueriesCreateMutation = {
  response: CommentQueriesCreateMutation$data;
  variables: CommentQueriesCreateMutation$variables;
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
    "concreteType": "Comment",
    "kind": "LinkedField",
    "name": "createComment",
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
        "name": "content",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "author",
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
        "name": "isHidden",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "createdAt",
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
    "name": "CommentQueriesCreateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CommentQueriesCreateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9bcb35e922794b54327236b868a341e9",
    "id": null,
    "metadata": {},
    "name": "CommentQueriesCreateMutation",
    "operationKind": "mutation",
    "text": "mutation CommentQueriesCreateMutation(\n  $input: CreateCommentInput!\n) {\n  createComment(input: $input) {\n    id\n    content\n    author\n    email\n    isHidden\n    createdAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "bea45f4a332f5e2fc7f7d2e4874f6327";

export default node;
