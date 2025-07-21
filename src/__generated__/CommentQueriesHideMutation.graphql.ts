/**
 * @generated SignedSource<<8a2c074bb191ff38306b84638c12b15f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CommentQueriesHideMutation$variables = {
  id: string;
};
export type CommentQueriesHideMutation$data = {
  readonly hideComment: {
    readonly id: string;
    readonly isHidden: boolean;
  };
};
export type CommentQueriesHideMutation = {
  response: CommentQueriesHideMutation$data;
  variables: CommentQueriesHideMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Comment",
    "kind": "LinkedField",
    "name": "hideComment",
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
        "name": "isHidden",
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
    "name": "CommentQueriesHideMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CommentQueriesHideMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c34e0bfad08c615234d04cd642ae10ef",
    "id": null,
    "metadata": {},
    "name": "CommentQueriesHideMutation",
    "operationKind": "mutation",
    "text": "mutation CommentQueriesHideMutation(\n  $id: ID!\n) {\n  hideComment(id: $id) {\n    id\n    isHidden\n  }\n}\n"
  }
};
})();

(node as any).hash = "abf2650a81a286ae6a9ab9c29eeba60f";

export default node;
