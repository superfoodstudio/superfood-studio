'use client';

import { View, Text, Button, Modal, Card, useToggle } from 'reshaped';
import { useLazyLoadQuery, useMutation } from 'react-relay';
import { Suspense, useState, useEffect } from 'react';
import type { MembershipQueriesQuery } from '@/__generated__/MembershipQueriesQuery.graphql';
import type { SetupIntentQueryQuery } from '@/__generated__/SetupIntentQueryQuery.graphql';
import { MembershipQuery } from './MembershipQueries';
import { SetupIntentQuery } from './SetupIntentQuery';
import { StripePaymentForm } from './StripePaymentForm';
import { 
  CreateSubscriptionMutation, 
  UpdateSubscriptionMutation, 
  CancelSubscriptionMutation,
  ReactivateSubscriptionMutation
} from './SubscriptionMutations';

function MembershipContent() {
  const data = useLazyLoadQuery<MembershipQueriesQuery>(MembershipQuery, {});
  const editModal = useToggle();
  const walletModal = useToggle();
  const cancelModal = useToggle();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Mutation hooks
  const [createSubscription] = useMutation(CreateSubscriptionMutation);
  const [updateSubscription] = useMutation(UpdateSubscriptionMutation);
  const [cancelSubscription] = useMutation(CancelSubscriptionMutation);
  const [reactivateSubscription] = useMutation(ReactivateSubscriptionMutation);

  const subscription = data.userSubscription;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: '2-digit',
      month: 'numeric',
      day: 'numeric'
    });
  };

  const getMembershipType = (plan: string | null) => {
    if (!plan) return 'none';
    return plan.toLowerCase().includes('month') ? 'monthly' : 'yearly';
  };

  const getCurrentPlanType = () => {
    if (!subscription) return null;
    return getMembershipType(subscription.plan);
  };

  const getJoinDate = (subscription: any) => {
    if (!subscription?.currentPeriodStart) return '—';
    return formatDate(subscription.currentPeriodStart);
  };

  // Handler for subscription plan selection and payment
  const handleSubscriptionPlan = async (plan: 'monthly' | 'yearly', paymentMethodId: string) => {
    setIsProcessing(true);
    
    try {
      const priceId = plan === 'monthly' 
        ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!
        : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!;

      if (subscription) {
        // Update existing subscription
        await new Promise((resolve, reject) => {
          updateSubscription({
            variables: {
              input: { priceId }
            },
            updater: (store) => {
              const updatedSubscription = store.getRootField('updateSubscription');
              const root = store.getRoot();
              root.setLinkedRecord(updatedSubscription, 'userSubscription');
            },
            onCompleted: () => {
              console.log('Subscription updated successfully');
              editModal.deactivate();
              setSelectedPlan(null);
              resolve(void 0);
            },
            onError: (error) => {
              console.error('Failed to update subscription:', error);
              reject(error);
            }
          });
        });
      } else {
        // Create new subscription
        await new Promise((resolve, reject) => {
          createSubscription({
            variables: {
              input: { priceId, paymentMethodId }
            },
            updater: (store) => {
              const newSubscription = store.getRootField('createSubscription');
              const root = store.getRoot();
              root.setLinkedRecord(newSubscription, 'userSubscription');
            },
            onCompleted: (response) => {
              console.log('Subscription created successfully');
              editModal.deactivate();
              setSelectedPlan(null);
              resolve(void 0);
            },
            onError: (error) => {
              console.error('Failed to create subscription:', error);
              reject(error);
            }
          });
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handler for payment method update
  const handlePaymentMethodUpdate = async (paymentMethodId: string) => {
    console.log('Payment method updated:', paymentMethodId);
    walletModal.deactivate();
  };

  // Handler for payment method errors
  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
  };

  return (
    <View 
      direction="column"
      gap={10}
      padding={10}
      backgroundColor="page"
      minHeight="100vh"
    >
      <View 
        maxWidth={400} 
        direction="column"
        gap={10}
        width="100%"
        paddingTop={10}
        attributes={{ style: { margin: 'auto' } }}
      >
        <Card 
          padding={8}
          attributes={{ 
            style: { 
              backgroundColor: '#ffffff',
              border: '1px solid #e0ddd8',
              borderRadius: '2px'
            } 
          }}
        >
          {/* Section Title */}
          <Text 
            attributes={{ 
              style: { 
                color: '#8a8a8a',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                marginBottom: '25px'
              } 
            }}
          >
            MANAGE MEMBERSHIP
          </Text>

          {/* Data Rows */}
          <View direction="column">
            {/* Join Date Row */}
            <View 
              direction="row" 
              justify="space-between"
              attributes={{ 
                style: { 
                  height: '35px',
                  padding: '12px 0',
                  borderBottom: '1px solid #e0ddd8',
                  alignItems: 'center'
                } 
              }}
            >
              <Text 
                attributes={{ 
                  style: { 
                    fontSize: '13px',
                    fontWeight: '400',
                    color: '#4a4a4a',
                    textTransform: 'lowercase'
                  } 
                }}
              >
                join date
              </Text>
              <Text 
                attributes={{ 
                  style: { 
                    fontSize: '13px',
                    fontWeight: '400',
                    color: '#4a4a4a',
                    textAlign: 'right'
                  } 
                }}
              >
                {getJoinDate(subscription)}
              </Text>
            </View>

            {/* Membership Type Row */}
            <View 
              direction="row" 
              justify="space-between"
              attributes={{ 
                style: { 
                  height: '35px',
                  padding: '12px 0',
                  borderBottom: '1px solid #e0ddd8',
                  alignItems: 'center'
                } 
              }}
            >
              <Text 
                attributes={{ 
                  style: { 
                    fontSize: '13px',
                    fontWeight: '400',
                    color: '#4a4a4a',
                    textTransform: 'lowercase'
                  } 
                }}
              >
                membership type
              </Text>
              <Text 
                attributes={{ 
                  style: { 
                    fontSize: '13px',
                    fontWeight: '400',
                    color: '#4a4a4a',
                    textAlign: 'right'
                  } 
                }}
              >
                {getMembershipType(subscription?.plan || null)}
              </Text>
            </View>

            {/* Details Row - Show subscription status */}
            <View 
              direction="row" 
              justify="space-between"
              attributes={{ 
                style: { 
                  height: '35px',
                  padding: '12px 0',
                  alignItems: 'center'
                } 
              }}
            >
              <Text 
                attributes={{ 
                  style: { 
                    fontSize: '13px',
                    fontWeight: '400',
                    color: '#4a4a4a',
                    textTransform: 'lowercase'
                  } 
                }}
              >
                status
              </Text>
              <Text 
                attributes={{ 
                  style: { 
                    fontSize: '13px',
                    fontWeight: '400',
                    color: subscription?.status === 'ACTIVE' ? '#6b4c7a' : '#4a4a4a',
                    textAlign: 'right'
                  } 
                }}
              >
                {subscription ? 
                  subscription.status.toLowerCase() : 
                  'inactive'
                }
              </Text>
            </View>

            {/* Auto-renewal status */}
            {subscription?.status === 'ACTIVE' && (
              <View 
                direction="row" 
                justify="space-between"
                attributes={{ 
                  style: { 
                    height: '35px',
                    padding: '12px 0',
                    borderBottom: '1px solid #e0ddd8',
                    alignItems: 'center'
                  } 
                }}
              >
                <Text 
                  attributes={{ 
                    style: { 
                      fontSize: '13px',
                      fontWeight: '400',
                      color: '#4a4a4a',
                      textTransform: 'lowercase'
                    } 
                  }}
                >
                  auto-renewal
                </Text>
                <Text 
                  attributes={{ 
                    style: { 
                      fontSize: '13px',
                      fontWeight: '400',
                      color: subscription.cancelAtPeriodEnd ? '#ef4444' : '#6b4c7a',
                      textAlign: 'right'
                    } 
                  }}
                >
                  {subscription.cancelAtPeriodEnd ? 'off' : 'on'}
                </Text>
              </View>
            )}

            {/* Next billing/expiry date */}
            {subscription?.status === 'ACTIVE' && (
              <View 
                direction="row" 
                justify="space-between"
                attributes={{ 
                  style: { 
                    height: '35px',
                    padding: '12px 0',
                    alignItems: 'center'
                  } 
                }}
              >
                <Text 
                  attributes={{ 
                    style: { 
                      fontSize: '13px',
                      fontWeight: '400',
                      color: '#4a4a4a',
                      textTransform: 'lowercase'
                    } 
                  }}
                >
                  {subscription.cancelAtPeriodEnd ? 'expires' : 'next billing'}
                </Text>
                <Text 
                  attributes={{ 
                    style: { 
                      fontSize: '13px',
                      fontWeight: '400',
                      color: '#4a4a4a',
                      textAlign: 'right'
                    } 
                  }}
                >
                  {formatDate(subscription.currentPeriodEnd)}
                </Text>
              </View>
            )}
          </View>

          {/* Button Section */}
          <View 
            direction="column" 
            align="center"
            gap={4}
            attributes={{ 
              style: { 
                marginTop: '40px'
              } 
            }}
          >
            {/* Edit Button */}
            <Button 
              onClick={() => {
                console.log('Edit button clicked!');
                editModal.activate();
              }}
              attributes={{ 
                style: { 
                  width: '200px',
                  height: '45px',
                  backgroundColor: '#6b4c7a',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: '500',
                  letterSpacing: '0.5px',
                  borderRadius: '25px',
                  cursor: 'pointer'
                } 
              }}
            >
              EDIT
            </Button>

            {/* Manage Wallet Button */}
            <Button 
              variant="outline"
              onClick={() => walletModal.activate()}
              attributes={{ 
                style: { 
                  width: '200px',
                  height: '45px',
                  backgroundColor: 'transparent',
                  border: '1px solid #6b4c7a',
                  color: '#6b4c7a',
                  fontSize: '11px',
                  fontWeight: '500',
                  letterSpacing: '0.5px',
                  borderRadius: '25px',
                  cursor: 'pointer'
                } 
              }}
            >
              MANAGE WALLET
            </Button>
          </View>
        </Card>
      </View>

      {/* Edit Subscription Modal */}
      <Modal 
        active={editModal.active} 
        onClose={editModal.deactivate}
        size="medium"
      >
        <View padding={6}>
          <View paddingBottom={4}>
            <Text variant="title-4" weight="bold">
              Edit Subscription
            </Text>
          </View>
          <View paddingBottom={6}>
            <Text>
              Choose your subscription plan:
            </Text>
          </View>
          
          <View direction="column" gap={4}>
            <Button 
              size="large"
              variant={selectedPlan === 'monthly' || getCurrentPlanType() === 'monthly' ? 'solid' : 'outline'}
              onClick={() => setSelectedPlan('monthly')}
              attributes={{ 
                style: { 
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  backgroundColor: selectedPlan === 'monthly' || getCurrentPlanType() === 'monthly' ? '#6b4c7a' : 'transparent',
                  color: selectedPlan === 'monthly' || getCurrentPlanType() === 'monthly' ? '#ffffff' : '#6b4c7a',
                  border: `1px solid #6b4c7a`
                } 
              }}
            >
              <View>
                <Text weight="bold" color={selectedPlan === 'monthly' || getCurrentPlanType() === 'monthly' ? 'primary' : undefined}>Monthly Plan</Text>
                <Text variant="caption-1" color={selectedPlan === 'monthly' || getCurrentPlanType() === 'monthly' ? 'primary' : 'neutral-faded'}>
                  Billed monthly{getCurrentPlanType() === 'monthly' ? ' (active)' : ''}
                </Text>
              </View>
              <Text weight="bold" color={selectedPlan === 'monthly' || getCurrentPlanType() === 'monthly' ? 'primary' : undefined}>$10/month</Text>
            </Button>

            <Button 
              size="large"
              variant={selectedPlan === 'yearly' || getCurrentPlanType() === 'yearly' ? 'solid' : 'outline'}
              onClick={() => setSelectedPlan('yearly')}
              attributes={{ 
                style: { 
                  justifyContent: 'space-between',
                  padding: '16px 20px',
                  backgroundColor: selectedPlan === 'yearly' || getCurrentPlanType() === 'yearly' ? '#6b4c7a' : 'transparent',
                  color: selectedPlan === 'yearly' || getCurrentPlanType() === 'yearly' ? '#ffffff' : '#6b4c7a',
                  border: `1px solid #6b4c7a`
                } 
              }}
            >
              <View>
                <Text weight="bold" color={selectedPlan === 'yearly' || getCurrentPlanType() === 'yearly' ? 'primary' : undefined}>Yearly Plan</Text>
                <Text variant="caption-1" color={selectedPlan === 'yearly' || getCurrentPlanType() === 'yearly' ? 'primary' : 'neutral-faded'}>
                  Billed annually - Save $25!{getCurrentPlanType() === 'yearly' ? ' (active)' : ''}
                </Text>
              </View>
              <Text weight="bold" color={selectedPlan === 'yearly' || getCurrentPlanType() === 'yearly' ? 'primary' : undefined}>$95/year</Text>
            </Button>
          </View>

          {selectedPlan && !subscription && (
            <View paddingTop={4}>
              <Text variant="caption-1" color="neutral-faded">
                You'll be prompted to enter your payment information after clicking Continue.
              </Text>
            </View>
          )}

          {/* Cancel/Reactivate Subscription Section */}
          {subscription && subscription.status === 'ACTIVE' && (
            <View paddingTop={6}>
              <View 
                padding={3}
                attributes={{
                  style: {
                    backgroundColor: subscription.cancelAtPeriodEnd ? '#f0f8ff' : '#fff5f5',
                    border: `1px solid ${subscription.cancelAtPeriodEnd ? '#6b4c7a' : '#ef4444'}`,
                    borderRadius: '4px',
                  }
                }}
              >
                <Text variant="caption-1" color="neutral" weight="medium">
                  {subscription.cancelAtPeriodEnd ? '🔄 Reactivate Subscription' : '⚠️ Cancel Subscription'}
                </Text>
                <Text variant="caption-1" color="neutral">
                  {subscription.cancelAtPeriodEnd 
                    ? 'Turn auto-renewal back on to continue your subscription beyond the expiry date.'
                    : `Your subscription will remain active until ${formatDate(subscription.currentPeriodEnd)}`
                  }
                </Text>
              </View>
            </View>
          )}

          <View direction="row" gap={3} paddingTop={6} justify={subscription ? 'space-between' : 'end'}>
            {/* Cancel/Reactivate subscription buttons */}
            {subscription && subscription.status === 'ACTIVE' && (
              subscription.cancelAtPeriodEnd ? (
                <Button
                  variant="outline"
                  disabled={isProcessing}
                  onClick={async () => {
                    setIsProcessing(true);
                    try {
                      await new Promise((resolve, reject) => {
                        reactivateSubscription({
                          variables: {},
                          updater: (store) => {
                            const reactivatedSubscription = store.getRootField('reactivateSubscription');
                            const root = store.getRoot();
                            root.setLinkedRecord(reactivatedSubscription, 'userSubscription');
                          },
                          onCompleted: () => {
                            console.log('Subscription reactivated successfully');
                            editModal.deactivate();
                            setSelectedPlan(null);
                            resolve(void 0);
                          },
                          onError: (error) => {
                            console.error('Failed to reactivate subscription:', error);
                            reject(error);
                          }
                        });
                      });
                    } catch (error) {
                      console.error('Reactivate subscription error:', error);
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                  attributes={{
                    style: {
                      borderColor: '#6b4c7a',
                      color: '#6b4c7a'
                    }
                  }}
                >
                  Reactivate Subscription
                </Button>
              ) : (
                <Button
                  variant="outline"
                  color="critical"
                  disabled={isProcessing}
                  onClick={() => cancelModal.activate()}
                  attributes={{
                    style: {
                      borderColor: '#ef4444',
                      color: '#ef4444'
                    }
                  }}
                >
                  Cancel Subscription
                </Button>
              )
            )}

            <View direction="row" gap={3}>
              <Button 
                variant="outline" 
                onClick={editModal.deactivate}
                disabled={isProcessing}
              >
                Close
              </Button>
              {(!subscription || selectedPlan) && (
                <Button
                  disabled={!selectedPlan || isProcessing}
                  onClick={() => {
                    if (selectedPlan) {
                      if (subscription) {
                        // Update existing subscription (no payment method needed)
                        handleSubscriptionPlan(selectedPlan, '');
                      } else {
                        // New subscription - need to collect payment method first
                        editModal.deactivate();
                        walletModal.activate();
                      }
                    }
                  }}
                >
                  {isProcessing ? 'Processing...' : subscription ? 'Update Plan' : 'Continue to Payment'}
                </Button>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Manage Wallet Modal */}
      <Modal 
        active={walletModal.active} 
        onClose={walletModal.deactivate}
        size="large"
      >
        <View padding={6}>
          <View paddingBottom={4}>
            <Text variant="title-4" weight="bold">
              {selectedPlan ? 'Complete Your Subscription' : 'Manage Payment Methods'}
            </Text>
          </View>
          <View paddingBottom={4}>
            <Text>
              {selectedPlan 
                ? `Enter your payment information to subscribe to the ${selectedPlan} plan.`
                : 'Update your payment information and billing address.'
              }
            </Text>
          </View>
          
          {selectedPlan && (
            <View 
              padding={3}
              attributes={{
                style: {
                  backgroundColor: '#f8f4ff',
                  border: '1px solid #6b4c7a',
                  borderRadius: '4px',
                  marginBottom: '16px',
                }
              }}
            >
              <Text variant="caption-1" color="neutral" weight="medium">
                📋 Subscription Details:
              </Text>
              <Text variant="caption-1" color="neutral">
                • You will be charged ${selectedPlan === 'monthly' ? '$10 per month' : '$95 per year'}
              </Text>
              <Text variant="caption-1" color="neutral">
                • Your subscription will auto-renew {selectedPlan === 'monthly' ? 'monthly' : 'annually'}
              </Text>
              <Text variant="caption-1" color="neutral">
                • You can cancel anytime in your membership settings
              </Text>
            </View>
          )}
          
          {/* Stripe Elements Form */}
          <Suspense fallback={<Text>Loading payment form...</Text>}>
            <StripePaymentForm
              selectedPlan={selectedPlan}
              onSuccess={(paymentMethodId) => {
                if (selectedPlan) {
                  // Complete subscription with payment method
                  handleSubscriptionPlan(selectedPlan, paymentMethodId);
                  walletModal.deactivate();
                } else {
                  // Just update payment method
                  handlePaymentMethodUpdate(paymentMethodId);
                }
              }}
              onError={handlePaymentError}
              onCancel={walletModal.deactivate}
            />
          </Suspense>
        </View>
      </Modal>

      {/* Cancel Confirmation Modal */}
      <Modal 
        active={cancelModal.active} 
        onClose={cancelModal.deactivate}
        size="small"
      >
        <View padding={6}>
          <View paddingBottom={4}>
            <Text variant="title-4" weight="bold">
              Turn Off Auto-Renewal?
            </Text>
          </View>
          <View paddingBottom={6}>
            <Text>
              This will turn off auto-renewal for your subscription. You'll continue to have full access until your subscription expires on {subscription ? formatDate(subscription.currentPeriodEnd) : ''}.
            </Text>
          </View>
          
          <View direction="row" gap={3} justify="end">
            <Button 
              variant="outline" 
              onClick={cancelModal.deactivate}
              disabled={isProcessing}
            >
              Keep Subscription
            </Button>
            <Button
              variant="solid"
              color="critical"
              disabled={isProcessing}
              onClick={async () => {
                setIsProcessing(true);
                try {
                  await new Promise((resolve, reject) => {
                    cancelSubscription({
                      variables: {},
                      updater: (store) => {
                        const cancelledSubscription = store.getRootField('cancelSubscription');
                        const root = store.getRoot();
                        root.setLinkedRecord(cancelledSubscription, 'userSubscription');
                      },
                      onCompleted: () => {
                        console.log('Subscription cancelled successfully');
                        cancelModal.deactivate();
                        editModal.deactivate();
                        setSelectedPlan(null);
                        resolve(void 0);
                      },
                      onError: (error) => {
                        console.error('Failed to cancel subscription:', error);
                        reject(error);
                      }
                    });
                  });
                } catch (error) {
                  console.error('Cancel subscription error:', error);
                } finally {
                  setIsProcessing(false);
                }
              }}
              attributes={{
                style: {
                  backgroundColor: '#ef4444',
                  borderColor: '#ef4444'
                }
              }}
            >
              {isProcessing ? 'Cancelling...' : 'Yes, Cancel'}
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function LoadingFallback() {
  return (
    <View 
      direction="column"
      align="center" 
      justify="center" 
      height="100vh"
      backgroundColor="page"
    >
      <Text>Loading membership...</Text>
    </View>
  );
}

export default function MembershipPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MembershipContent />
    </Suspense>
  );
}