/**
 * @generated SignedSource<<3df814c95f46fcf956d8a4810b72d6ea>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UpdateSiteSettingsInput = {
  homepageVideoUrl?: string | null;
  weeklyGroceryList?: string | null;
};
export type SiteSettingsQueriesUpdateMutation$variables = {
  input: UpdateSiteSettingsInput;
};
export type SiteSettingsQueriesUpdateMutation$data = {
  readonly updateSiteSettings: {
    readonly createdAt: any;
    readonly homepageVideoUrl: string | null;
    readonly id: string;
    readonly updatedAt: any;
    readonly weeklyGroceryList: string | null;
  };
};
export type SiteSettingsQueriesUpdateMutation = {
  response: SiteSettingsQueriesUpdateMutation$data;
  variables: SiteSettingsQueriesUpdateMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "SiteSettings",
    "kind": "LinkedField",
    "name": "updateSiteSettings",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SiteSettingsQueriesUpdateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SiteSettingsQueriesUpdateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "013357c4e7c998559208a4fd86a0008d",
    "id": null,
    "metadata": {},
    "name": "SiteSettingsQueriesUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation SiteSettingsQueriesUpdateMutation(\n  $input: UpdateSiteSettingsInput!\n) {\n  updateSiteSettings(input: $input) {\n    id\n    homepageVideoUrl\n    weeklyGroceryList\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "b2203e0f48dfabe820335ec3a9e6bb73";

export default node;
