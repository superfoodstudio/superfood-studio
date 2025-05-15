import { graphql } from 'relay-runtime';

// Define the fragment directly to avoid circular dependencies
export const RecipeCardFragment = graphql`
  fragment RecipeCardFragment on Recipe {
    id
    name
    slug
    description
    category
    mediaUrl
    uploadDate
  }
`;

export const RecipeListQuery = graphql`
  query RecipeQueriesRecipeListQuery($category: String, $limit: Int, $offset: Int) {
    publicRecipes(category: $category, limit: $limit, offset: $offset) {
      ...RecipeCardFragment
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
  }
`; 