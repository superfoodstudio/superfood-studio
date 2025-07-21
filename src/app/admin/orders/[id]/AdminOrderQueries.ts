import { graphql } from 'relay-runtime';

export const AdminOrderQuery = graphql`
  query AdminOrderQueries_AdminOrderQuery($orderId: String!) {
    adminOrder(orderId: $orderId) {
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
        id
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