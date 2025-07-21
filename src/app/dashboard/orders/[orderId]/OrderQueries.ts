import { graphql } from 'relay-runtime';

export const UserOrderQuery = graphql`
  query OrderQueries_UserOrderQuery($orderId: String!) {
    userOrder(orderId: $orderId) {
      id
      userId
      total
      status
      createdAt
      updatedAt
      stripeSessionId
      shippingAddress {
        street
        city
        state
        zipCode
        country
      }
      user {
        email
        firstName
        lastName
      }
      items {
        id
        productId
        quantity
        price
        product {
          id
          name
          slug
          description
          photoUrl
          price
          category
          tags
        }
      }
    }
  }
`;