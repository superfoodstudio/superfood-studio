import { graphql } from 'relay-runtime';

export const RecipeCommentsQuery = graphql`
  query CommentQueriesRecipeCommentsQuery($recipeId: ID!, $first: Int!, $after: String) {
    ...CommentQueriesRecipeCommentsPaginationFragment @arguments(recipeId: $recipeId, first: $first, after: $after)
  }
`;

export const RecipeCommentsPaginationFragment = graphql`
  fragment CommentQueriesRecipeCommentsPaginationFragment on Query
  @refetchable(queryName: "CommentQueriesRecipeCommentsPaginationQuery")
  @argumentDefinitions(
    recipeId: { type: "ID!" }
    first: { type: "Int", defaultValue: 10 }
    after: { type: "String" }
  ) {
    recipeCommentsConnection(recipeId: $recipeId, first: $first, after: $after)
    @connection(key: "RecipeCommentsList_recipeCommentsConnection") {
      totalCount
      edges {
        node {
          id
          content
          author
          isHidden
          createdAt
        }
      }
      pageInfo {
        hasNextPage
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