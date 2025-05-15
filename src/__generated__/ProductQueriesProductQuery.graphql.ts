/**
 * @generated SignedSource<<49086bc62035ec695026009b932f5604>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type ProductQueriesProductQuery$variables = {
  id: string;
};
export type ProductQueriesProductQuery$data = {
  readonly product: {
    readonly category: string;
    readonly createdAt: any;
    readonly description: string;
    readonly id: string;
    readonly inventory: number;
    readonly isActive: boolean;
    readonly name: string;
    readonly photoUrl: string;
    readonly price: number;
    readonly slug: string;
    readonly stripePriceId: string | null;
    readonly stripeProductId: string | null;
    readonly tags: ReadonlyArray<string>;
    readonly updatedAt: any;
    readonly videoUrl: string | null;
  } | null;
};
export type ProductQueriesProductQuery = {
  response: ProductQueriesProductQuery$data;
  variables: ProductQueriesProductQuery$variables;
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
    "concreteType": "Product",
    "kind": "LinkedField",
    "name": "product",
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
        "kind": "ScalarField",
        "name": "description",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "photoUrl",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "videoUrl",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "price",
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
        "name": "tags",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "inventory",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isActive",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "stripeProductId",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "stripePriceId",
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
    "name": "ProductQueriesProductQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ProductQueriesProductQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7d128bc6ee78090acdba23a9e7c5179f",
    "id": null,
    "metadata": {},
    "name": "ProductQueriesProductQuery",
    "operationKind": "query",
    "text": "query ProductQueriesProductQuery(\n  $id: ID!\n) {\n  product(id: $id) {\n    id\n    name\n    slug\n    description\n    photoUrl\n    videoUrl\n    price\n    category\n    tags\n    inventory\n    isActive\n    stripeProductId\n    stripePriceId\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "dccbb4224a1cdd04d7675eba79f2e8ea";

export default node;
