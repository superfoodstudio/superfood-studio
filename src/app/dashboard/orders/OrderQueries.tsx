import { graphql } from 'react-relay';

export const UserOrdersQuery = graphql`
  query OrderQueriesUserOrdersQuery($first: Int!, $after: String) {
    ...OrderQueriesUserOrdersPaginationFragment
  }
`;

export const UserOrdersPaginationFragment = graphql`
  fragment OrderQueriesUserOrdersPaginationFragment on Query
  @refetchable(queryName: "OrderQueriesUserOrdersPaginationQuery") {
    userOrders(first: $first, after: $after)
    @connection(key: "UserOrdersList_userOrders") {
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