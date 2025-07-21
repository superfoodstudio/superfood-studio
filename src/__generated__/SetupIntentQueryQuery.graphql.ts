/**
 * @generated SignedSource<<bdcceff8c25046945a16ec4ac2f8c060>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type SetupIntentQueryQuery$variables = {};
export type SetupIntentQueryQuery$data = {
  readonly createSetupIntent: {
    readonly clientSecret: string;
  };
};
export type SetupIntentQueryQuery = {
  response: SetupIntentQueryQuery$data;
  variables: SetupIntentQueryQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "SetupIntent",
    "kind": "LinkedField",
    "name": "createSetupIntent",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "clientSecret",
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
    "name": "SetupIntentQueryQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SetupIntentQueryQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "4acf668e023c36dea596c8194dd00fc6",
    "id": null,
    "metadata": {},
    "name": "SetupIntentQueryQuery",
    "operationKind": "query",
    "text": "query SetupIntentQueryQuery {\n  createSetupIntent {\n    clientSecret\n  }\n}\n"
  }
};
})();

(node as any).hash = "e0168b786a8c32d9bd6acdb9a230f602";

export default node;
