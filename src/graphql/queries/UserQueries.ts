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