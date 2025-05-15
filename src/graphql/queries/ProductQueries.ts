import { graphql } from 'relay-runtime';

// Import the fragment from the component
import { ProductCardFragment } from '@/components/products/ProductCard';

export const ProductListQuery = graphql`
  query ProductQueriesProductListQuery($category: String!, $limit: Int, $offset: Int) {
    productsByCategory(category: $category, limit: $limit, offset: $offset) {
      ...ProductCardFragment
    }
  }
`;

export const ProductDetailQuery = graphql`
  query ProductQueriesProductDetailQuery($id: ID!) {
    product(id: $id) {
      ...ProductQueriesProductDetail_product
    }
  }
`;

export const ProductDetailBySlugQuery = graphql`
  query ProductQueriesProductDetailBySlugQuery($slug: String!) {
    productBySlug(slug: $slug) {
      ...ProductQueriesProductDetail_product
    }
  }
`;

export const ProductDetailFragment = graphql`
  fragment ProductQueriesProductDetail_product on Product {
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
  }
`;

// Query to fetch a single product by ID
export const ProductQuery = graphql`
  query ProductQueriesProductQuery($id: ID!) {
    product(id: $id) {
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
      stripeProductId
      stripePriceId
      createdAt
      updatedAt
    }
  }
`;

// Query to fetch products with pagination
export const ProductsConnectionQuery = graphql`
  query ProductQueriesProductsConnectionQuery(
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
    ) {
      edges {
        cursor
        node {
          ...ProductCardFragment
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

// Query to fetch products by category with pagination
export const ProductsByCategoryConnectionQuery = graphql`
  query ProductQueriesProductsByCategoryConnectionQuery(
    $first: Int
    $after: String
    $category: String!
  ) {
    productsByCategoryConnection(
      first: $first
      after: $after
      category: $category
    ) {
      edges {
        cursor
        node {
          ...ProductCardFragment
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

// Legacy queries (keeping for backward compatibility)
export const ProductsQuery = graphql`
  query ProductQueriesProductsQuery(
    $category: String
    $status: String
    $search: String
    $sort: String
  ) {
    products(
      category: $category
      status: $status
      search: $search
      sort: $sort
    ) {
      ...ProductCardFragment
    }
  }
`;

export const ProductsByCategoryQuery = graphql`
  query ProductQueriesProductsByCategoryQuery(
    $category: String!
    $limit: Int
    $offset: Int
  ) {
    productsByCategory(
      category: $category
      limit: $limit
      offset: $offset
    ) {
      ...ProductCardFragment
    }
  }
`; 