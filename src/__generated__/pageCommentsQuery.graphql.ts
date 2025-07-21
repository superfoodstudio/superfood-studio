/**
 * @generated SignedSource<<9401b731ef5e2f225b0ecbf700bcbb3c>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type pageCommentsQuery$variables = {};
export type pageCommentsQuery$data = {
  readonly recipes: ReadonlyArray<{
    readonly comments: ReadonlyArray<{
      readonly author: string;
      readonly content: string;
      readonly createdAt: any;
      readonly email: string | null;
      readonly id: string;
      readonly isHidden: boolean;
    }>;
    readonly id: string;
    readonly name: string;
    readonly slug: string;
  }>;
};
export type pageCommentsQuery = {
  response: pageCommentsQuery$data;
  variables: pageCommentsQuery$variables;
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
    "args": [
      {
        "kind": "Literal",
        "name": "status",
        "value": "all"
      }
    ],
    "concreteType": "Recipe",
    "kind": "LinkedField",
    "name": "recipes",
    "plural": true,
    "selections": [
      (v0/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "slug",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Comment",
        "kind": "LinkedField",
        "name": "comments",
        "plural": true,
        "selections": [
          (v0/*: any*/),
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
    ],
    "storageKey": "recipes(status:\"all\")"
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "pageCommentsQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "pageCommentsQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3ca6e18146148403e04145db18c91a9f",
    "id": null,
    "metadata": {},
    "name": "pageCommentsQuery",
    "operationKind": "query",
    "text": "query pageCommentsQuery {\n  recipes(status: \"all\") {\n    id\n    name\n    slug\n    comments {\n      id\n      content\n      author\n      email\n      isHidden\n      createdAt\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a59a1a88bae368d567e1a12a69f5bec2";

export default node;
