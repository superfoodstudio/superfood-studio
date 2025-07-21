import { graphql } from 'relay-runtime';

export const FeaturedRecipeQuery = graphql`
  query FeaturedRecipeQueryQuery {
    publicRecipes(limit: 1, offset: 0) {
      id
      name
      slug
      description
      category
      mediaUrl
      uploadDate
    }
  }
`;