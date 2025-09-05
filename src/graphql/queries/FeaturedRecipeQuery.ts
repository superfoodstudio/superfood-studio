import { graphql } from 'relay-runtime';

export const FeaturedRecipeQuery = graphql`
  query FeaturedRecipeQueryQuery {
    featuredRecipe {
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
`;