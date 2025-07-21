import { graphql } from 'relay-runtime';

export const UserSubscriptionQuery = graphql`
  query SubscriptionQueriesUserSubscriptionQuery {
    userSubscription {
      id
      status
      plan
      currentPeriodStart
      currentPeriodEnd
      cancelAtPeriodEnd
      stripeSubscriptionId
    }
  }
`;