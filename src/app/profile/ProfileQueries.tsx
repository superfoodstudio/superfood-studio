import { graphql } from 'react-relay';

export const UserOrdersQuery = graphql`
  query ProfileQueriesUserOrdersQuery {
    userOrders {
      id
      total
      status
      createdAt
      items {
        id
        quantity
        price
        product {
          name
          photoUrl
        }
      }
    }
  }
`;

export const OrderByPaymentIntentQuery = graphql`
  query ProfileQueriesOrderByPaymentIntentQuery($paymentIntentId: String!) {
    orderByPaymentIntent(paymentIntentId: $paymentIntentId) {
      id
      total
      status
      createdAt
      items {
        id
        quantity
        price
        product {
          name
          photoUrl
        }
      }
    }
  }
`;