/**
 * @generated SignedSource<<ee68ac5afa7ec7db3283016d4f2d6fd4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type SiteSettingsQueriesQuery$variables = {};
export type SiteSettingsQueriesQuery$data = {
  readonly siteSettings: {
    readonly createdAt: any;
    readonly homepageVideoUrl: string | null;
    readonly id: string;
    readonly updatedAt: any;
    readonly weeklyGroceryList: string | null;
  } | null;
};
export type SiteSettingsQueriesQuery = {
  response: SiteSettingsQueriesQuery$data;
  variables: SiteSettingsQueriesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "SiteSettings",
    "kind": "LinkedField",
    "name": "siteSettings",
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
        "name": "homepageVideoUrl",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "weeklyGroceryList",
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SiteSettingsQueriesQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SiteSettingsQueriesQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "9c3709b5c8b9f9e8a4236aad437be10b",
    "id": null,
    "metadata": {},
    "name": "SiteSettingsQueriesQuery",
    "operationKind": "query",
    "text": "query SiteSettingsQueriesQuery {\n  siteSettings {\n    id\n    homepageVideoUrl\n    weeklyGroceryList\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "40983712bd2b4d2d710d4c5feb5a2c11";

export default node;
