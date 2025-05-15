/**
 * @generated SignedSource<<4b43830d55f1db881c72f337431eb243>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CartQueriesCartDetails_cart$data = {
  readonly id: string;
  readonly items: ReadonlyArray<{
    readonly id: string;
    readonly price: number;
    readonly product: {
      readonly id: string;
      readonly name: string;
      readonly photoUrl: string;
    };
    readonly quantity: number;
  }>;
  readonly total: number;
  readonly " $fragmentType": "CartQueriesCartDetails_cart";
};
export type CartQueriesCartDetails_cart$key = {
  readonly " $data"?: CartQueriesCartDetails_cart$data;
  readonly " $fragmentSpreads": FragmentRefs<"CartQueriesCartDetails_cart">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CartQueriesCartDetails_cart",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "total",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "CartItem",
      "kind": "LinkedField",
      "name": "items",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "quantity",
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
          "concreteType": "Product",
          "kind": "LinkedField",
          "name": "product",
          "plural": false,
          "selections": [
            (v0/*: any*/),
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
              "name": "photoUrl",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Cart",
  "abstractKey": null
};
})();

(node as any).hash = "51cb034055d645b7e3387364c58bbbe2";

export default node;
