import { graphql } from 'react-relay';

export const AdminDashboardQuery = graphql`
  query AdminQueriesQuery {
    adminMetrics {
      totalOrders
      totalRevenue
      activeSubscriptions
      pendingOrders
    }
    recentOrders(limit: 5) {
      id
      customerName
      customerEmail
      total
      status
      date
      itemCount
    }
  }
`;

export const AdminOrdersQuery = graphql`
  query AdminQueriesOrdersQuery($limit: Int, $offset: Int) {
    adminOrders(limit: $limit, offset: $offset) {
      id
      customerName
      customerEmail
      total
      status
      date
      items {
        id
        productName
        quantity
        price
        photoUrl
      }
    }
  }
`;

export const AdminOrdersConnectionQuery = graphql`
  query AdminQueriesOrdersConnectionQuery(
    $first: Int
    $after: String
    $status: String
  ) {
    adminOrdersConnection(first: $first, after: $after, status: $status) 
    @connection(key: "AdminOrdersList_adminOrdersConnection") {
      edges {
        cursor
        node {
          id
          customerName
          customerEmail
          total
          status
          date
          items {
            id
            productName
            quantity
            price
            photoUrl
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const AdminProductsConnectionQuery = graphql`
  query AdminQueriesProductsConnectionQuery(
    $first: Int
    $after: String
    $category: String
    $status: String
    $search: String
    $sort: String
  ) {
    productsConnection(
      first: $first
      after: $after
      category: $category
      status: $status
      search: $search
      sort: $sort
    ) @connection(key: "AdminProductsList_productsConnection") {
      edges {
        cursor
        node {
          id
          name
          slug
          description
          photoUrl
          videoUrl
          price
          category
          tags
          inventory
          isActive
          createdAt
          updatedAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const AdminRecipesConnectionQuery = graphql`
  query AdminQueriesRecipesConnectionQuery(
    $first: Int
    $after: String
    $category: String
    $status: String
    $search: String
    $sort: String
  ) {
    recipesConnection(
      first: $first
      after: $after
      category: $category
      status: $status
      search: $search
      sort: $sort
    ) @connection(key: "AdminRecipesList_recipesConnection") {
      edges {
        cursor
        node {
          id
          name
          slug
          description
          category
          isPublished
          mediaUrl
          previewImageUrl
          uploadDate
          createdAt
          updatedAt
          ingredients
          instructions
          comments {
            id
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;