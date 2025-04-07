/**
 * @generated SignedSource<<b696af2e23479803300bacd75631df29>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type pageAdminRecipesQuery$variables = Record<PropertyKey, never>;
export type pageAdminRecipesQuery$data = {
  readonly recipes: ReadonlyArray<{
    readonly category: string;
    readonly id: string;
    readonly isPublished: boolean;
    readonly name: string;
    readonly uploadDate: any;
  }>;
};
export type pageAdminRecipesQuery = {
  response: pageAdminRecipesQuery$data;
  variables: pageAdminRecipesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Recipe",
    "kind": "LinkedField",
    "name": "recipes",
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
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "category",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isPublished",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "uploadDate",
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
    "name": "pageAdminRecipesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "pageAdminRecipesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "04082c34a8b81c4e1082b7ef2bb643cd",
    "id": null,
    "metadata": {},
    "name": "pageAdminRecipesQuery",
    "operationKind": "query",
    "text": "query pageAdminRecipesQuery {\n  recipes {\n    id\n    name\n    category\n    isPublished\n    uploadDate\n  }\n}\n"
  }
};
})();

(node as any).hash = "580f99c4576c64a2c11fd76e79fbc769";

export default node;
