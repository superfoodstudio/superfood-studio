/**
 * @generated SignedSource<<ab5c28c2e0bb74a937b2a958cc4d03e1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type pageCommentsQuery$variables = {};
export type pageCommentsQuery$data = {
  readonly recipes: {
    readonly edges: ReadonlyArray<{
      readonly node: {
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
      };
    }>;
  };
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
        "name": "first",
        "value": 100
      },
      {
        "kind": "Literal",
        "name": "status",
        "value": "all"
      }
    ],
    "concreteType": "RecipeConnection",
    "kind": "LinkedField",
    "name": "recipes",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "RecipeEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Recipe",
            "kind": "LinkedField",
            "name": "node",
            "plural": false,
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
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": "recipes(first:100,status:\"all\")"
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
    "cacheID": "bc7cc6c9e181f2831bf5a58da448a0a5",
    "id": null,
    "metadata": {},
    "name": "pageCommentsQuery",
    "operationKind": "query",
    "text": "query pageCommentsQuery {\n  recipes(first: 100, status: \"all\") {\n    edges {\n      node {\n        id\n        name\n        slug\n        comments {\n          id\n          content\n          author\n          email\n          isHidden\n          createdAt\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "5bbdf91417220afaff59fdcf5f97ebbe";

export default node;
