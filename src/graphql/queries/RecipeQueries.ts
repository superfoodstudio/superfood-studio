import { graphql } from 'relay-runtime';

// Don't import the fragment directly
// Define the fragment string directly here to avoid importing from RecipeCard
const RecipeCardFragment = `
  fragment RecipeCardFragment on Recipe {
    id
    name
    slug
    description
    category
    mediaUrl
    previewImageUrl
    uploadDate
  }
`;

export const RecipeListQuery = graphql`
  query RecipeQueriesRecipeListQuery($category: String, $first: Int, $after: String) {
    publicRecipes(category: $category, first: $first, after: $after) {
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
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const RecipeDetailQuery = graphql`
  query RecipeQueriesRecipeDetailQuery($id: ID!) {
    recipe(id: $id) {
      ...RecipeQueriesRecipeDetail_recipe
    }
  }
`;

export const RecipeDetailBySlugQuery = graphql`
  query RecipeQueriesRecipeDetailBySlugQuery($slug: String!) {
    recipeBySlug(slug: $slug) {
      ...RecipeQueriesRecipeDetail_recipe
    }
  }
`;

export const RecipeDetailFragment = graphql`
  fragment RecipeQueriesRecipeDetail_recipe on Recipe {
    id
    name
    slug
    description
    category
    mediaUrl
    ingredients
    instructions
    uploadDate
    createdAt
    averageRating
    totalRatings
    ratings(first: 10) {
      edges {
        node {
          id
          rating
          createdAt
          user {
            id
            firstName
            lastName
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