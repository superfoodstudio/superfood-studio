import { graphql } from 'react-relay';

export const MembershipQuery = graphql`
  query MembershipQueriesQuery {
    userSubscription {
      id
      status
      plan
      currentPeriodStart
      currentPeriodEnd
      cancelAtPeriodEnd
      stripeSubscriptionId
    }
    userPaymentMethods {
      id
      brand
      last4
      expMonth
      expYear
      isDefault
    }
  }
`;
