/**
 * @generated SignedSource<<167c084259d2d31eaae37eeb11c6dcd9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UpdateSiteSettingsInput = {
  homepageVideoUrl?: string | null;
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
    "cacheID": "0f7d2d08d1aaf64bc0d293b9efaaf6c5",
    "id": null,
    "metadata": {},
    "name": "SiteSettingsQueriesUpdateMutation",
    "operationKind": "mutation",
    "text": "mutation SiteSettingsQueriesUpdateMutation(\n  $input: UpdateSiteSettingsInput!\n) {\n  updateSiteSettings(input: $input) {\n    id\n    homepageVideoUrl\n    createdAt\n    updatedAt\n  }\n}\n"
  }
};
})();

(node as any).hash = "b3e641b9acd2775dc3db6b5de72e47be";

export default node;
