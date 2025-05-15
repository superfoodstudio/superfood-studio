import { graphql } from 'relay-runtime';

export const CartQuery = graphql`
  query CartQueriesCartQuery {
    cart {
      ...CartQueriesCartDetails_cart
    }
  }
`;

export const CartDetailsFragment = graphql`
  fragment CartQueriesCartDetails_cart on Cart {
    id
    total
    items {
      id
      quantity
      price
      product {
        id
        name
        photoUrl
      }
    }
  }
`;

export const AddToCartMutation = graphql`
  mutation CartQueriesAddToCartMutation($input: AddToCartInput!) {
    addToCart(input: $input) {
      ...CartQueriesCartDetails_cart
    }
  }
`;

export const RemoveFromCartMutation = graphql`
  mutation CartQueriesRemoveFromCartMutation($cartItemId: ID!) {
    removeFromCart(cartItemId: $cartItemId) {
      ...CartQueriesCartDetails_cart
    }
  }
`;

export const UpdateCartItemMutation = graphql`
  mutation CartQueriesUpdateCartItemMutation($cartItemId: ID!, $quantity: Int!) {
    updateCartItem(cartItemId: $cartItemId, quantity: $quantity) {
      ...CartQueriesCartDetails_cart
    }
  }
`;

export const ClearCartMutation = graphql`
  mutation CartQueriesClearCartMutation {
    clearCart {
      id
    }
  }
`; 