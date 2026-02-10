'use client';

export const dynamic = 'force-dynamic';

import { View, Text, Button, Modal, Skeleton } from 'reshaped';
import { useLazyLoadQuery, useMutation } from 'react-relay';
import { Suspense, useState } from 'react';
import { QueryErrorBoundary } from '@/components/ui/QueryErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'phosphor-react';
import type { MembershipQueriesQuery } from '@/__generated__/MembershipQueriesQuery.graphql';
import { MembershipQuery } from './MembershipQueries';
import { StripePaymentForm } from './StripePaymentForm';
import {
  CreateSubscriptionMutation,
  UpdateSubscriptionMutation,
  CancelSubscriptionMutation,
  ReactivateSubscriptionMutation
} from './SubscriptionMutations';

type ModalStep = 'select-plan' | 'confirm-change' | 'payment' | 'cancel' | 'success' | null;

function MembershipContent() {
  const data = useLazyLoadQuery<MembershipQueriesQuery>(MembershipQuery, {});
  const [modalStep, setModalStep] = useState<ModalStep>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Mutation hooks
  const [createSubscription] = useMutation(CreateSubscriptionMutation);
  const [updateSubscription] = useMutation(UpdateSubscriptionMutation);
  const [cancelSubscription] = useMutation(CancelSubscriptionMutation);
  const [reactivateSubscription] = useMutation(ReactivateSubscriptionMutation);

  const subscription = data.userSubscription;

  const defaultCard = data.userPaymentMethods?.find(pm => pm.isDefault)
    || data.userPaymentMethods?.[0] || null;

  const closeModal = () => {
    setModalStep(null);
    setSelectedPlan(null);
    setIsProcessing(false);
    setSuccessMessage('');
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setIsProcessing(false);
    setModalStep('success');
  };

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

  const getJoinDate = (sub: typeof subscription) => {
    if (!sub?.currentPeriodStart) return '—';
    return formatDate(sub.currentPeriodStart);
  };

  // Handler for updating an existing subscription (plan change)
  const handlePlanChange = async (plan: 'monthly' | 'yearly') => {
    setIsProcessing(true);
    try {
      const priceId = plan === 'monthly'
        ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!
        : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!;

      await new Promise((resolve, reject) => {
        updateSubscription({
          variables: { input: { priceId } },
          updater: (store) => {
            const updated = store.getRootField('updateSubscription');
            if (updated) store.getRoot().setLinkedRecord(updated, 'userSubscription');
          },
          onCompleted: () => resolve(void 0),
          onError: reject
        });
      });
      showSuccess(`Your plan has been changed to ${plan}.`);
    } catch {
      setIsProcessing(false);
    }
  };

  // Handler for creating a new subscription with payment
  const handleNewSubscription = async (plan: 'monthly' | 'yearly', paymentMethodId: string) => {
    setIsProcessing(true);
    try {
      const priceId = plan === 'monthly'
        ? process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID!
        : process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID!;

      await new Promise((resolve, reject) => {
        createSubscription({
          variables: { input: { priceId, paymentMethodId } },
          updater: (store) => {
            const created = store.getRootField('createSubscription');
            if (created) store.getRoot().setLinkedRecord(created, 'userSubscription');
          },
          onCompleted: () => resolve(void 0),
          onError: reject
        });
      });
      showSuccess('Your subscription is now active.');
    } catch {
      setIsProcessing(false);
    }
  };

  // Handler for cancelling subscription
  const handleCancel = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve, reject) => {
        cancelSubscription({
          variables: {},
          updater: (store) => {
            const cancelled = store.getRootField('cancelSubscription');
            if (cancelled) store.getRoot().setLinkedRecord(cancelled, 'userSubscription');
          },
          onCompleted: () => resolve(void 0),
          onError: reject
        });
      });
      showSuccess('Auto-renewal has been turned off.');
    } catch {
      setIsProcessing(false);
    }
  };

  // Handler for reactivating subscription (turn auto-renewal back on)
  const handleReactivate = async () => {
    setIsProcessing(true);
    try {
      await new Promise((resolve, reject) => {
        reactivateSubscription({
          variables: {},
          updater: (store) => {
            const reactivated = store.getRootField('reactivateSubscription');
            if (reactivated) store.getRoot().setLinkedRecord(reactivated, 'userSubscription');
          },
          onCompleted: () => resolve(void 0),
          onError: reject
        });
      });
      showSuccess('Auto-renewal has been turned back on.');
    } catch {
      setIsProcessing(false);
    }
  };

  const stepAnimation = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.2 }
  };

  // ── Select Plan View ──
  const SelectPlanView = () => {
    const isActive = subscription && subscription.status === 'ACTIVE';
    const isMonthlyCurrent = getCurrentPlanType() === 'monthly';
    const isYearlyCurrent = getCurrentPlanType() === 'yearly';
    const showMonthlyHighlight = selectedPlan === 'monthly' || (isMonthlyCurrent && !selectedPlan);
    const showYearlyHighlight = selectedPlan === 'yearly' || (isYearlyCurrent && !selectedPlan);
    const isSameAsCurrent = selectedPlan === getCurrentPlanType();
    const showContinue = selectedPlan && !isSameAsCurrent;

    return (
      <View direction="column">
        <View paddingBottom={2}>
          <Text
            attributes={{
              style: {
                fontSize: '13px', fontWeight: '600', letterSpacing: '1.2px',
                textTransform: 'uppercase', color: '#8a8a8a'
              }
            }}
          >
            {isActive ? 'EDIT SUBSCRIPTION' : 'CHOOSE A PLAN'}
          </Text>
        </View>
        <View paddingBottom={6}>
          <Text attributes={{ style: { fontSize: '13px', color: '#6b6b6b' } }}>
            Choose your subscription plan:
          </Text>
        </View>

        <View direction="column" gap={3}>
          {/* Monthly card */}
          <View
            padding={4}
            attributes={{
              style: {
                border: showMonthlyHighlight ? '2px solid #3d3d3d' : '1px solid #e0ddd8',
                borderRadius: '6px', cursor: 'pointer',
                backgroundColor: showMonthlyHighlight ? '#fafaf9' : '#ffffff',
                transition: 'all 0.15s ease',
              },
              onClick: () => setSelectedPlan('monthly'),
            }}
          >
            <View direction="row" justify="space-between" align="center">
              <View direction="column" gap={1}>
                <View direction="row" gap={2} align="center">
                  <Text attributes={{ style: { fontSize: '14px', fontWeight: '600', color: '#2d2d2d' } }}>
                    Monthly
                  </Text>
                  {isMonthlyCurrent && (
                    <Text attributes={{
                      style: {
                        fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px',
                        textTransform: 'uppercase', color: '#8a8a8a',
                        backgroundColor: '#f0eeeb', padding: '2px 8px', borderRadius: '10px',
                      }
                    }}>
                      current
                    </Text>
                  )}
                </View>
                <Text attributes={{ style: { fontSize: '12px', color: '#8a8a8a' } }}>
                  Billed monthly
                </Text>
              </View>
              <Text attributes={{ style: { fontSize: '16px', fontWeight: '600', color: '#2d2d2d' } }}>
                $10<Text attributes={{ style: { fontSize: '12px', fontWeight: '400', color: '#8a8a8a' } }}>/mo</Text>
              </Text>
            </View>
          </View>

          {/* Yearly card */}
          <View
            padding={4}
            attributes={{
              style: {
                border: showYearlyHighlight ? '2px solid #3d3d3d' : '1px solid #e0ddd8',
                borderRadius: '6px', cursor: 'pointer',
                backgroundColor: showYearlyHighlight ? '#fafaf9' : '#ffffff',
                transition: 'all 0.15s ease',
              },
              onClick: () => setSelectedPlan('yearly'),
            }}
          >
            <View direction="row" justify="space-between" align="center">
              <View direction="column" gap={1}>
                <View direction="row" gap={2} align="center">
                  <Text attributes={{ style: { fontSize: '14px', fontWeight: '600', color: '#2d2d2d' } }}>
                    Yearly
                  </Text>
                  {isYearlyCurrent && (
                    <Text attributes={{
                      style: {
                        fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px',
                        textTransform: 'uppercase', color: '#8a8a8a',
                        backgroundColor: '#f0eeeb', padding: '2px 8px', borderRadius: '10px',
                      }
                    }}>
                      current
                    </Text>
                  )}
                  <Text attributes={{
                    style: {
                      fontSize: '10px', fontWeight: '600', letterSpacing: '0.5px',
                      textTransform: 'uppercase', color: '#5a8a5a',
                      backgroundColor: '#f0f7f0', padding: '2px 8px', borderRadius: '10px',
                    }
                  }}>
                    save $25
                  </Text>
                </View>
                <Text attributes={{ style: { fontSize: '12px', color: '#8a8a8a' } }}>
                  Billed annually
                </Text>
              </View>
              <Text attributes={{ style: { fontSize: '16px', fontWeight: '600', color: '#2d2d2d' } }}>
                $95<Text attributes={{ style: { fontSize: '12px', fontWeight: '400', color: '#8a8a8a' } }}>/yr</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Hint for new subscribers */}
        {selectedPlan && !isActive && (
          <View paddingTop={4}>
            <Text attributes={{ style: { fontSize: '12px', color: '#8a8a8a' } }}>
              You'll be prompted to enter payment information after clicking Continue.
            </Text>
          </View>
        )}

        {/* Footer */}
        <View direction="row" gap={3} paddingTop={8} justify="space-between" align="center">
          {/* Auto-renewal toggle link for active subs */}
          <View>
            {isActive && !subscription?.cancelAtPeriodEnd && (
              <Text
                attributes={{
                  style: {
                    fontSize: '12px', color: '#8a8a8a', cursor: 'pointer',
                    textDecoration: 'underline', textUnderlineOffset: '2px',
                  },
                  onClick: () => setModalStep('cancel'),
                }}
              >
                turn off auto-renewal
              </Text>
            )}
            {isActive && subscription?.cancelAtPeriodEnd && (
              <Text
                attributes={{
                  style: {
                    fontSize: '12px', color: '#8a8a8a', cursor: 'pointer',
                    textDecoration: 'underline', textUnderlineOffset: '2px',
                  },
                  onClick: handleReactivate,
                }}
              >
                {isProcessing ? 'reactivating...' : 'turn on auto-renewal'}
              </Text>
            )}
          </View>

          <View direction="row" gap={3}>
            <Button
              variant="ghost"
              onClick={closeModal}
              attributes={{ style: { fontSize: '13px', color: '#6b6b6b' } }}
            >
              Close
            </Button>
            {showContinue && (
              <Button
                onClick={() => {
                  if (!selectedPlan) return;
                  if (isActive) {
                    setModalStep('confirm-change');
                  } else {
                    setModalStep('payment');
                  }
                }}
                attributes={{
                  style: {
                    backgroundColor: '#3d3d3d', color: '#ffffff', border: 'none',
                    borderRadius: '6px', fontSize: '13px', fontWeight: '500', padding: '8px 20px',
                  }
                }}
              >
                {isActive ? 'Change Plan' : 'Continue'}
              </Button>
            )}
          </View>
        </View>
      </View>
    );
  };

  // ── Confirm Change View ──
  const ConfirmChangeView = () => (
    <View direction="column">
      <View paddingBottom={2}>
        <Text
          attributes={{
            style: {
              fontSize: '13px', fontWeight: '600', letterSpacing: '1.2px',
              textTransform: 'uppercase', color: '#8a8a8a'
            }
          }}
        >
          CONFIRM PLAN CHANGE
        </Text>
      </View>
      <View paddingBottom={4}>
        <Text attributes={{ style: { fontSize: '13px', color: '#6b6b6b', lineHeight: '1.5' } }}>
          {selectedPlan === 'yearly'
            ? 'You are switching from Monthly ($10/mo) to Yearly ($95/yr). Your card on file will be charged a prorated amount for the remainder of this billing cycle.'
            : `You are switching from Yearly ($95/yr) to Monthly ($10/mo). Your yearly plan stays active until ${subscription ? formatDate(subscription.currentPeriodEnd) : 'the end of your current period'}. After that, you'll be billed $10/month.`
          }
        </Text>
      </View>

      {/* Plan comparison */}
      <View
        padding={4}
        attributes={{
          style: {
            backgroundColor: '#fafaf9', border: '1px solid #e0ddd8',
            borderRadius: '6px', marginBottom: '16px',
          }
        }}
      >
        <View direction="column" gap={1}>
          <View direction="row" justify="space-between">
            <Text attributes={{ style: { fontSize: '12px', color: '#8a8a8a' } }}>
              Current plan
            </Text>
            <Text attributes={{ style: { fontSize: '12px', fontWeight: '500', color: '#4a4a4a' } }}>
              {getCurrentPlanType() === 'monthly' ? 'Monthly — $10/mo' : 'Yearly — $95/yr'}
            </Text>
          </View>
          <View direction="row" justify="space-between">
            <Text attributes={{ style: { fontSize: '12px', color: '#8a8a8a' } }}>
              New plan
            </Text>
            <Text attributes={{ style: { fontSize: '12px', fontWeight: '500', color: '#2d2d2d' } }}>
              {selectedPlan === 'monthly' ? 'Monthly — $10/mo' : 'Yearly — $95/yr'}
            </Text>
          </View>
        </View>
      </View>

      {/* Card on file */}
      {defaultCard && (
        <View paddingBottom={4}>
          <Text attributes={{ style: { fontSize: '12px', color: '#8a8a8a' } }}>
            Charging {defaultCard.brand} ending in {defaultCard.last4}
          </Text>
        </View>
      )}

      {/* Footer */}
      <View direction="row" gap={3} paddingTop={4} justify="end">
        <Button
          variant="ghost"
          onClick={() => setModalStep('select-plan')}
          disabled={isProcessing}
          attributes={{ style: { fontSize: '13px', color: '#6b6b6b' } }}
        >
          Back
        </Button>
        <Button
          disabled={isProcessing}
          onClick={() => {
            if (selectedPlan) handlePlanChange(selectedPlan);
          }}
          attributes={{
            style: {
              backgroundColor: isProcessing ? '#e0ddd8' : '#3d3d3d',
              color: '#ffffff', border: 'none', borderRadius: '6px',
              fontSize: '13px', fontWeight: '500', padding: '8px 20px',
            }
          }}
        >
          {isProcessing ? 'Processing...' : 'Confirm Change'}
        </Button>
      </View>
    </View>
  );

  // ── Payment View (new subscription) ──
  const PaymentView = () => (
    <View direction="column">
      <View paddingBottom={2}>
        <Text
          attributes={{
            style: {
              fontSize: '13px', fontWeight: '600', letterSpacing: '1.2px',
              textTransform: 'uppercase', color: '#8a8a8a'
            }
          }}
        >
          COMPLETE SUBSCRIPTION
        </Text>
      </View>
      <View paddingBottom={6}>
        <Text attributes={{ style: { fontSize: '13px', color: '#6b6b6b' } }}>
          {`Enter your payment details for the ${selectedPlan} plan.`}
        </Text>
      </View>

      {/* Plan summary */}
      {selectedPlan && (
        <View
          padding={4}
          attributes={{
            style: {
              backgroundColor: '#fafaf9', border: '1px solid #e0ddd8',
              borderRadius: '6px', marginBottom: '20px',
            }
          }}
        >
          <View direction="column" gap={1}>
            <View direction="row" justify="space-between">
              <Text attributes={{ style: { fontSize: '12px', color: '#8a8a8a' } }}>Plan</Text>
              <Text attributes={{ style: { fontSize: '12px', fontWeight: '500', color: '#4a4a4a' } }}>
                {selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'}
              </Text>
            </View>
            <View direction="row" justify="space-between">
              <Text attributes={{ style: { fontSize: '12px', color: '#8a8a8a' } }}>Amount</Text>
              <Text attributes={{ style: { fontSize: '12px', fontWeight: '500', color: '#4a4a4a' } }}>
                {selectedPlan === 'monthly' ? '$10/month' : '$95/year'}
              </Text>
            </View>
            <View direction="row" justify="space-between">
              <Text attributes={{ style: { fontSize: '12px', color: '#8a8a8a' } }}>Renewal</Text>
              <Text attributes={{ style: { fontSize: '12px', fontWeight: '500', color: '#4a4a4a' } }}>
                Auto-renews {selectedPlan === 'monthly' ? 'monthly' : 'annually'}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Stripe Elements Form */}
      <Suspense fallback={
        <View direction="column" gap={3} padding={4}>
          <Skeleton height="2.5rem" width="100%" borderRadius="small" />
          <Skeleton height="2.5rem" width="100%" borderRadius="small" />
        </View>
      }>
        <StripePaymentForm
          selectedPlan={selectedPlan}
          onSuccess={(paymentMethodId) => {
            if (selectedPlan) handleNewSubscription(selectedPlan, paymentMethodId);
          }}
          onError={() => {}}
          onCancel={() => setModalStep('select-plan')}
        />
      </Suspense>
    </View>
  );

  // ── Cancel View ──
  const CancelView = () => (
    <View direction="column">
      <View paddingBottom={2}>
        <Text
          attributes={{
            style: {
              fontSize: '13px', fontWeight: '600', letterSpacing: '1.2px',
              textTransform: 'uppercase', color: '#8a8a8a'
            }
          }}
        >
          TURN OFF AUTO-RENEWAL
        </Text>
      </View>
      <View paddingBottom={6}>
        <Text attributes={{ style: { fontSize: '13px', color: '#6b6b6b', lineHeight: '1.5' } }}>
          This will turn off auto-renewal. You'll keep full access until {subscription ? formatDate(subscription.currentPeriodEnd) : ''}.
        </Text>
      </View>

      <View direction="row" gap={3} justify="end">
        <Button
          variant="ghost"
          onClick={() => setModalStep('select-plan')}
          disabled={isProcessing}
          attributes={{ style: { fontSize: '13px', color: '#6b6b6b' } }}
        >
          Back
        </Button>
        <Button
          disabled={isProcessing}
          onClick={handleCancel}
          attributes={{
            style: {
              backgroundColor: isProcessing ? '#e0ddd8' : '#3d3d3d',
              color: '#ffffff', border: 'none', borderRadius: '6px',
              fontSize: '13px', fontWeight: '500', padding: '8px 20px',
            }
          }}
        >
          {isProcessing ? 'Cancelling...' : 'Confirm'}
        </Button>
      </View>
    </View>
  );

  // ── Success View ──
  const SuccessView = () => (
    <View direction="column" align="center" gap={4} padding={4}>
      <CheckCircle size={48} weight="light" color="#3d3d3d" />
      <Text attributes={{ style: { fontSize: '14px', fontWeight: '500', color: '#2d2d2d', textAlign: 'center' } }}>
        {successMessage}
      </Text>
      <Button
        variant="ghost"
        onClick={closeModal}
        attributes={{ style: { fontSize: '13px', color: '#6b6b6b', marginTop: '8px' } }}
      >
        Done
      </Button>
    </View>
  );

  return (
    <View direction="column" padding={6}>
      <View
        direction="column" gap={6} width="100%"
        attributes={{ style: { maxWidth: '500px', margin: '0 auto' } }}
      >
        <View direction="column" gap={6}>
          {/* Section Title */}
          <Text
            attributes={{
              style: {
                color: '#8a8a8a', fontSize: '14px', fontWeight: '600',
                letterSpacing: '1.2px', textTransform: 'uppercase',
              }
            }}
          >
            MANAGE MEMBERSHIP
          </Text>

          {/* Data Rows */}
          <View direction="column">
            {/* Join Date Row */}
            <View
              direction="row" justify="space-between"
              attributes={{
                style: { height: '35px', padding: '12px 0', borderBottom: '1px solid #e0ddd8', alignItems: 'center' }
              }}
            >
              <Text attributes={{ style: { fontSize: '13px', fontWeight: '400', color: '#4a4a4a', textTransform: 'lowercase' } }}>
                join date
              </Text>
              <Text attributes={{ style: { fontSize: '13px', fontWeight: '400', color: '#4a4a4a', textAlign: 'right' } }}>
                {getJoinDate(subscription)}
              </Text>
            </View>

            {/* Membership Type Row */}
            <View
              direction="row" justify="space-between"
              attributes={{
                style: { height: '35px', padding: '12px 0', borderBottom: '1px solid #e0ddd8', alignItems: 'center' }
              }}
            >
              <Text attributes={{ style: { fontSize: '13px', fontWeight: '400', color: '#4a4a4a', textTransform: 'lowercase' } }}>
                membership type
              </Text>
              <Text attributes={{ style: { fontSize: '13px', fontWeight: '400', color: '#4a4a4a', textAlign: 'right' } }}>
                {getMembershipType(subscription?.plan || null)}
              </Text>
            </View>

            {/* Status Row */}
            <View
              direction="row" justify="space-between"
              attributes={{
                style: { height: '35px', padding: '12px 0', alignItems: 'center' }
              }}
            >
              <Text attributes={{ style: { fontSize: '13px', fontWeight: '400', color: '#4a4a4a', textTransform: 'lowercase' } }}>
                status
              </Text>
              <Text
                attributes={{
                  style: {
                    fontSize: '13px', fontWeight: '400',
                    color: subscription?.status === 'ACTIVE' ? '#6b4c7a' : '#4a4a4a',
                    textAlign: 'right'
                  }
                }}
              >
                {subscription ? subscription.status.toLowerCase() : 'inactive'}
              </Text>
            </View>

            {/* Auto-renewal status */}
            {subscription?.status === 'ACTIVE' && (
              <View
                direction="row" justify="space-between"
                attributes={{
                  style: { height: '35px', padding: '12px 0', borderBottom: '1px solid #e0ddd8', alignItems: 'center' }
                }}
              >
                <Text attributes={{ style: { fontSize: '13px', fontWeight: '400', color: '#4a4a4a', textTransform: 'lowercase' } }}>
                  auto-renewal
                </Text>
                <Text
                  attributes={{
                    style: {
                      fontSize: '13px', fontWeight: '400',
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
                direction="row" justify="space-between"
                attributes={{
                  style: { height: '35px', padding: '12px 0', alignItems: 'center' }
                }}
              >
                <Text attributes={{ style: { fontSize: '13px', fontWeight: '400', color: '#4a4a4a', textTransform: 'lowercase' } }}>
                  {subscription.cancelAtPeriodEnd ? 'expires' : 'next billing'}
                </Text>
                <Text attributes={{ style: { fontSize: '13px', fontWeight: '400', color: '#4a4a4a', textAlign: 'right' } }}>
                  {formatDate(subscription.currentPeriodEnd)}
                </Text>
              </View>
            )}
          </View>

          {/* Button Section */}
          <View direction="column" align="center" paddingTop={4}>
            <Button
              variant="outline"
              size="small"
              onClick={() => setModalStep('select-plan')}
            >
              Edit Membership
            </Button>
          </View>
        </View>
      </View>

      {/* Single Modal with Animated Frames */}
      <Modal
        active={modalStep !== null}
        onClose={closeModal}
        size="500px"
      >
        <View padding={5}>
          <AnimatePresence mode="wait">
            <motion.div
              key={modalStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {modalStep === 'select-plan' && <SelectPlanView />}
              {modalStep === 'confirm-change' && <ConfirmChangeView />}
              {modalStep === 'payment' && <PaymentView />}
              {modalStep === 'cancel' && <CancelView />}
              {modalStep === 'success' && <SuccessView />}
            </motion.div>
          </AnimatePresence>
        </View>
      </Modal>
    </View>
  );
}

function LoadingFallback() {
  return (
    <View direction="column" padding={6}>
      <View
        direction="column" gap={6} width="100%"
        attributes={{ style: { maxWidth: '500px', margin: '0 auto' } }}
      >
        <Skeleton height="0.85rem" width="140px" borderRadius="small" />
        <View direction="column" gap={3}>
          {[...Array(4)].map((_, i) => (
            <View key={i} direction="row" justify="space-between" padding={2}
              attributes={{ style: { borderBottom: i < 3 ? '1px solid #e0ddd8' : 'none' } }}
            >
              <Skeleton height="0.75rem" width="100px" borderRadius="small" />
              <Skeleton height="0.75rem" width="60px" borderRadius="small" />
            </View>
          ))}
        </View>
        <View direction="column" align="center" gap={2} paddingTop={4}>
          <Skeleton height="2.25rem" width="140px" borderRadius="medium" />
        </View>
      </View>
    </View>
  );
}

export default function MembershipPage() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <MembershipContent />
      </Suspense>
    </QueryErrorBoundary>
  );
}
