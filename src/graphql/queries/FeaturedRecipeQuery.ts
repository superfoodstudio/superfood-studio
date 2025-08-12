import { graphql } from 'relay-runtime';

export const FeaturedRecipeQuery = graphql`
  query FeaturedRecipeQueryQuery {
    publicRecipes(first: 1) {
      edges {
        node {
          id
          name
          slug
          description
          category
          mediaUrl
          previewImageUrl
          uploadDate
        }
      }
    }
  }
`;