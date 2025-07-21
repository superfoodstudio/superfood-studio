import { graphql } from 'react-relay';

export const SetupIntentQuery = graphql`
  query SetupIntentQueryQuery {
    createSetupIntent {
      clientSecret
    }
  }
`;