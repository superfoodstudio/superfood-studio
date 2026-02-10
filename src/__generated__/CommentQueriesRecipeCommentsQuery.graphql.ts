/**
 * @generated SignedSource<<211e22574abaf610b36aebab06faa5a7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CommentQueriesRecipeCommentsQuery$variables = {
  after?: string | null;
  first: number;
  recipeId: string;
};
export type CommentQueriesRecipeCommentsQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"CommentQueriesRecipeCommentsPaginationFragment">;
};
export type CommentQueriesRecipeCommentsQuery = {
  response: CommentQueriesRecipeCommentsQuery$data;
  variables: CommentQueriesRecipeCommentsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "recipeId"
},
v3 = [
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "CommentQueriesRecipeCommentsQuery",
    "selections": [
      {
        "args": (v3/*: any*/),
        "kind": "FragmentSpread",
        "name": "CommentQueriesRecipeCommentsPaginationFragment"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "CommentQueriesRecipeCommentsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
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
        "args": (v3/*: any*/),
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
    "cacheID": "5ed2badf84bb1c33ccaa842c0450bb07",
    "id": null,
    "metadata": {},
    "name": "CommentQueriesRecipeCommentsQuery",
    "operationKind": "query",
    "text": "query CommentQueriesRecipeCommentsQuery(\n  $recipeId: ID!\n  $first: Int!\n  $after: String\n) {\n  ...CommentQueriesRecipeCommentsPaginationFragment_2Kr0OE\n}\n\nfragment CommentQueriesRecipeCommentsPaginationFragment_2Kr0OE on Query {\n  recipeCommentsConnection(recipeId: $recipeId, first: $first, after: $after) {\n    totalCount\n    edges {\n      node {\n        id\n        content\n        author\n        isHidden\n        createdAt\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d99751ab90bc6a8a23111e22acf0e2e1";

export default node;
