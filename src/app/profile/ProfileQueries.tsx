import { graphql } from 'react-relay';

export const UserOrdersQuery = graphql`
  query ProfileQueriesUserOrdersQuery {
    userOrders(first: 50) {
      edges {
        node {
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
      pageInfo {
        hasNextPage
        endCursor
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