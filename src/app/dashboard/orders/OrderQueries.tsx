import { graphql } from 'react-relay';

export const UserOrdersQuery = graphql`
  query OrderQueriesUserOrdersQuery {
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
  query OrderQueriesOrderByPaymentIntentQuery($paymentIntentId: String!) {
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