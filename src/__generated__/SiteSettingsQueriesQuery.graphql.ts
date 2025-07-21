/**
 * @generated SignedSource<<202705da8cd6969da171f4fcb64aff01>>
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
    "cacheID": "02dbc68ea3b62b3b719ece09d61635f4",
    "id": null,
    "metadata": {},
    "name": "SiteSettingsQueriesQuery",
    "operationKind": "query",
    "text": "query SiteSettingsQueriesQuery {\n  siteSettings {\n    id\n    homepageVideoUrl\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "448d6ba30fbe9d6cee2643a2a3a48cfa";

export default node;
