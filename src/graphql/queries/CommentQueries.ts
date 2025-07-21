import { graphql } from 'relay-runtime';

export const RecipeCommentsQuery = graphql`
  query CommentQueriesRecipeCommentsQuery($recipeId: ID!) {
    recipeComments(recipeId: $recipeId) {
      id
      content
      author
      email
      isHidden
      createdAt
    }
  }
`;

export const RecipeCommentsConnectionQuery = graphql`
  query CommentQueriesRecipeCommentsConnectionQuery(
    $recipeId: ID!
    $first: Int
    $after: String
  ) {
    recipeCommentsConnection(recipeId: $recipeId, first: $first, after: $after) {
      edges {
        cursor
        node {
          id
          content
          author
          email
          isHidden
          createdAt
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

export const CreateCommentMutation = graphql`
  mutation CommentQueriesCreateMutation($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      content
      author
      email
      isHidden
      createdAt
    }
  }
`;

export const HideCommentMutation = graphql`
  mutation CommentQueriesHideMutation($id: ID!) {
    hideComment(id: $id) {
      id
      isHidden
    }
  }
`;

export const DeleteCommentMutation = graphql`
  mutation CommentQueriesDeleteMutation($id: ID!) {
    deleteComment(id: $id) {
      success
    }
  }
`;