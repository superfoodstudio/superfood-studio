import { graphql } from 'react-relay';

export const CreateSubscriptionMutation = graphql`
  mutation SubscriptionMutationsCreateSubscriptionMutation($input: CreateSubscriptionInput!) {
    createSubscription(input: $input) {
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

export const UpdateSubscriptionMutation = graphql`
  mutation SubscriptionMutationsUpdateSubscriptionMutation($input: UpdateSubscriptionInput!) {
    updateSubscription(input: $input) {
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

export const CancelSubscriptionMutation = graphql`
  mutation SubscriptionMutationsCancelSubscriptionMutation {
    cancelSubscription {
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

export const ReactivateSubscriptionMutation = graphql`
  mutation SubscriptionMutationsReactivateSubscriptionMutation {
    reactivateSubscription {
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