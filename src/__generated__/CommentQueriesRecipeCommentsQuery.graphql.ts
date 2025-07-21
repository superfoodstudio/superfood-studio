/**
 * @generated SignedSource<<19f6327996008e9b5f440d65e42c7fb3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type CommentQueriesRecipeCommentsQuery$variables = {
  recipeId: string;
};
export type CommentQueriesRecipeCommentsQuery$data = {
  readonly recipeComments: ReadonlyArray<{
    readonly author: string;
    readonly content: string;
    readonly createdAt: any;
    readonly email: string | null;
    readonly id: string;
    readonly isHidden: boolean;
  }>;
};
export type CommentQueriesRecipeCommentsQuery = {
  response: CommentQueriesRecipeCommentsQuery$data;
  variables: CommentQueriesRecipeCommentsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "recipeId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "recipeId",
        "variableName": "recipeId"
      }
    ],
    "concreteType": "Comment",
    "kind": "LinkedField",
    "name": "recipeComments",
    "plural": true,
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
    "name": "CommentQueriesRecipeCommentsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CommentQueriesRecipeCommentsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ef5725be3dad63aa31dcbe6864ad7e3c",
    "id": null,
    "metadata": {},
    "name": "CommentQueriesRecipeCommentsQuery",
    "operationKind": "query",
    "text": "query CommentQueriesRecipeCommentsQuery(\n  $recipeId: ID!\n) {\n  recipeComments(recipeId: $recipeId) {\n    id\n    content\n    author\n    email\n    isHidden\n    createdAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "bf0ea8a66c47f4f2d81a22481537ae04";

export default node;
