/**
 * @generated SignedSource<<512896a9b6b4b6f00d724e87ab4fa990>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CartQueriesClearCartMutation$variables = {};
export type CartQueriesClearCartMutation$data = {
  readonly clearCart: {
    readonly id: string;
  };
};
export type CartQueriesClearCartMutation = {
  response: CartQueriesClearCartMutation$data;
  variables: CartQueriesClearCartMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Cart",
    "kind": "LinkedField",
    "name": "clearCart",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
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
    "name": "CartQueriesClearCartMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "CartQueriesClearCartMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "7002ea56edb4e7c8dd7a381598d81a05",
    "id": null,
    "metadata": {},
    "name": "CartQueriesClearCartMutation",
    "operationKind": "mutation",
    "text": "mutation CartQueriesClearCartMutation {\n  clearCart {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "7d0b29fd24e4b76bf396219d20e289ee";

export default node;
