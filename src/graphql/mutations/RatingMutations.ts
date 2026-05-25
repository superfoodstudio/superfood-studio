import { graphql } from 'relay-runtime';

export const RateRecipeMutation = graphql`
  mutation RatingMutationsRateRecipeMutation($input: RateRecipeInput!) {
    rateRecipe(input: $input) {
      id
      rating
      createdAt
      updatedAt
      userId
    }
  }
`;

export const RateProductMutation = graphql`
  mutation RatingMutationsRateProductMutation($input: RateProductInput!) {
    rateProduct(input: $input) {
      id
      rating
      createdAt
      updatedAt
      userId
    }
  }
`;
