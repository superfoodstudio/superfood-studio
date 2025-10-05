import { graphql } from 'relay-runtime';

export const CurrentUserQuery = graphql`
  query UserQueriesCurrentUserQuery {
    currentUser {
      id
      email
      firstName
      lastName
      createdAt
      updatedAt
    }
  }
`;

export const UpdateUserMutation = graphql`
  mutation UserQueriesUpdateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      email
      firstName
      lastName
      updatedAt
    }
  }
`;