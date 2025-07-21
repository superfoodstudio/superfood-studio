/**
 * @generated SignedSource<<e10ed5d88fdb99dd3247e609565fd6e5>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CommentQueriesDeleteMutation$variables = {
  id: string;
};
export type CommentQueriesDeleteMutation$data = {
  readonly deleteComment: {
    readonly success: boolean;
  };
};
export type CommentQueriesDeleteMutation = {
  response: CommentQueriesDeleteMutation$data;
  variables: CommentQueriesDeleteMutation$variables;
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
    "concreteType": "DeleteCommentResponse",
    "kind": "LinkedField",
    "name": "deleteComment",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "success",
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
    "name": "CommentQueriesDeleteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CommentQueriesDeleteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "121b19630a9dc40fc839c7c58d944b38",
    "id": null,
    "metadata": {},
    "name": "CommentQueriesDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation CommentQueriesDeleteMutation(\n  $id: ID!\n) {\n  deleteComment(id: $id) {\n    success\n  }\n}\n"
  }
};
})();

(node as any).hash = "6d8cf0af48939193eee12d35fb65e395";

export default node;
