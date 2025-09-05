import { graphql } from 'relay-runtime';

export const FeaturedProductQuery = graphql`
  query FeaturedProductQueryQuery {
    featuredProduct {
      id
      name
      slug
      description
      photoUrl
      price
      category
    }
  }
`;