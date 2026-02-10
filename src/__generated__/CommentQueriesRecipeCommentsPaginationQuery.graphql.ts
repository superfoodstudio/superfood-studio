/**
 * @generated SignedSource<<3ae1b750dcccf6ee14c8f68b57cb9ccc>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CommentQueriesRecipeCommentsPaginationQuery$variables = {
  after?: string | null;
  first?: number | null;
  recipeId: string;
};
export type CommentQueriesRecipeCommentsPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"CommentQueriesRecipeCommentsPaginationFragment">;
};
export type CommentQueriesRecipeCommentsPaginationQuery = {
  response: CommentQueriesRecipeCommentsPaginationQuery$data;
  variables: CommentQueriesRecipeCommentsPaginationQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "after"
  },
  {
    "defaultValue": 10,
    "kind": "LocalArgument",
    "name": "first"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "recipeId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
  },
  {
    "kind": "Variable",
    "name": "recipeId",
    "variableName": "recipeId"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CommentQueriesRecipeCommentsPaginationQuery",
    "selections": [
      {
        "args": (v1/*: any*/),
        "kind": "FragmentSpread",
        "name": "CommentQueriesRecipeCommentsPaginationFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CommentQueriesRecipeCommentsPaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CommentConnection",
        "kind": "LinkedField",
        "name": "recipeCommentsConnection",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "totalCount",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "CommentEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Comment",
                "kind": "LinkedField",
                "name": "node",
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
                    "name": "isHidden",
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
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v1/*: any*/),
        "filters": [
          "recipeId"
        ],
        "handle": "connection",
        "key": "RecipeCommentsList_recipeCommentsConnection",
        "kind": "LinkedHandle",
        "name": "recipeCommentsConnection"
      }
    ]
  },
  "params": {
    "cacheID": "c90c8422a2ece6f8a53e1527f8a8e18f",
    "id": null,
    "metadata": {},
    "name": "CommentQueriesRecipeCommentsPaginationQuery",
    "operationKind": "query",
    "text": "query CommentQueriesRecipeCommentsPaginationQuery(\n  $after: String\n  $first: Int = 10\n  $recipeId: ID!\n) {\n  ...CommentQueriesRecipeCommentsPaginationFragment_2Kr0OE\n}\n\nfragment CommentQueriesRecipeCommentsPaginationFragment_2Kr0OE on Query {\n  recipeCommentsConnection(recipeId: $recipeId, first: $first, after: $after) {\n    totalCount\n    edges {\n      node {\n        id\n        content\n        author\n        isHidden\n        createdAt\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "7531e66816e441d05974f7b3637c6912";

export default node;
