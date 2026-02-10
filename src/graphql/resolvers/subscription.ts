import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-08-16' as Stripe.LatestApiVersion,
});

export const subscriptionResolvers = {
  Query: {
    // Create setup intent for payment method collection
    createSetupIntent: async (_parent: any, _args: any, context: any) => {
      try {
        // Get full user data including ID and email
        const user = await context.getFullUser();

        if (!user?.isAuthenticated || !user?.id) {
          throw new Error('User must be authenticated');
        }

        // Get user from database to check for Stripe customer ID
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id }
        });

        if (!dbUser) {
          throw new Error('User not found');
        }

        // Create Stripe customer if doesn't exist
        let stripeCustomerId = dbUser.stripeCustomerId;
        
        if (!stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            name: `${dbUser.firstName} ${dbUser.lastName}`.trim() || dbUser.email,
            metadata: {
              userId: user.id
            }
          });
          
          stripeCustomerId = customer.id;
          
          // Update user with Stripe customer ID
          await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: stripeCustomerId }
          });
        }

        // Create setup intent
        const setupIntent = await stripe.setupIntents.create({
          customer: stripeCustomerId,
          usage: 'off_session',
        });

        return {
          clientSecret: setupIntent.client_secret
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    // Get user's current subscription
    userSubscription: async (_parent: any, _args: any, context: any) => {
      try {
        const user = await context.getFullUser();
        if (!user?.isAuthenticated || !user?.id) {
          return null;
        }

        // Find user's active subscription
        let subscription = await prisma.subscription.findFirst({
          where: {
            userId: user.id,
            status: {
              in: ['ACTIVE', 'PENDING', 'CANCELED'] // Include canceled to show cancelled status
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        if (!subscription) {
          return null;
        }

        // Check if subscription has expired (currentPeriodEnd < now)
        if (
          subscription.status === 'ACTIVE' &&
          subscription.currentPeriodEnd &&
          subscription.currentPeriodEnd < new Date()
        ) {
          // Expire the subscription in DB
          await prisma.subscription.update({
            where: { id: subscription.id },
            data: { status: 'EXPIRED' },
          });
          subscription = { ...subscription, status: 'EXPIRED' };
        }

        return {
          id: subscription.id,
          status: subscription.status,
          plan: subscription.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'Monthly Plan' : 'Yearly Plan',
          currentPeriodStart: subscription.currentPeriodStart?.toISOString() || new Date().toISOString(),
          currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || new Date().toISOString(),
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          stripeSubscriptionId: subscription.stripeSubscriptionId
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    // Get user's payment methods
    userPaymentMethods: async (_parent: any, _args: any, context: any) => {
      try {
        const user = await context.getFullUser();
        if (!user?.isAuthenticated || !user?.id) {
          return [];
        }

        // Get user from database to check for Stripe customer ID
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id }
        });

        if (!dbUser || !dbUser.stripeCustomerId) {
          return [];
        }

        // Get payment methods and customer default from Stripe
        const [paymentMethods, customer] = await Promise.all([
          stripe.paymentMethods.list({
            customer: dbUser.stripeCustomerId,
            type: 'card',
          }),
          stripe.customers.retrieve(dbUser.stripeCustomerId),
        ]);

        const defaultPmId = (typeof customer !== 'string' && !customer.deleted)
          ? customer.invoice_settings?.default_payment_method
          : null;

        return paymentMethods.data.map(pm => ({
          id: pm.id,
          brand: pm.card?.brand || 'unknown',
          last4: pm.card?.last4 || '0000',
          expMonth: pm.card?.exp_month || 1,
          expYear: pm.card?.exp_year || 2000,
          isDefault: pm.id === defaultPmId,
        }));
      } catch (error) {
        console.error(error);
        return [];
      }
    }
  },

  Mutation: {
    // Create a new subscription
    createSubscription: async (_parent: any, args: { input: { priceId: string; paymentMethodId: string } }, context: any) => {
      try {
        const user = await context.getFullUser();

        if (!user?.isAuthenticated || !user?.id) {
          throw new Error('User must be authenticated');
        }

        const { priceId, paymentMethodId } = args.input;

        // Validate price ID
        const validPriceIds = [process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID, process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID];
        if (!validPriceIds.includes(priceId)) {
          throw new Error('Invalid price ID');
        }

        // Check if user already has a subscription record
        const existingSubscription = await prisma.subscription.findFirst({
          where: { userId: user.id }
        });

        if (existingSubscription?.status === 'ACTIVE') {
          throw new Error('User already has an active subscription');
        }

        // Get user from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id }
        });

        if (!dbUser) {
          throw new Error('User not found');
        }

        // Create Stripe customer if doesn't exist
        let stripeCustomerId = dbUser.stripeCustomerId;
        
        if (!stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            name: `${dbUser.firstName} ${dbUser.lastName}`.trim() || dbUser.email,
            metadata: {
              userId: user.id
            }
          });
          
          stripeCustomerId = customer.id;
          
          // Update user with Stripe customer ID
          await prisma.user.update({
            where: { id: user.id },
            data: { stripeCustomerId: stripeCustomerId }
          });
        }

        // Attach payment method to customer
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: stripeCustomerId,
        });

        // Set as default payment method
        await stripe.customers.update(stripeCustomerId, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });

        // Create Stripe subscription
        const stripeSubscription = await stripe.subscriptions.create({
          customer: stripeCustomerId,
          items: [
            {
              price: priceId,
            },
          ],
          default_payment_method: paymentMethodId,
          expand: ['latest_invoice.payment_intent'],
        });

        // Save subscription to database in a transaction
        const subscription_data = stripeSubscription as any;
        const currentPeriodStart = subscription_data.current_period_start ? new Date(subscription_data.current_period_start * 1000) : new Date();
        const currentPeriodEnd = subscription_data.current_period_end ? new Date(subscription_data.current_period_end * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default to 30 days from now

        const subscriptionFields = {
          stripeSubscriptionId: stripeSubscription.id,
          stripePriceId: priceId,
          status: 'ACTIVE' as const,
          plan: (priceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'MONTHLY' : 'YEARLY') as 'MONTHLY' | 'YEARLY',
          startDate: currentPeriodStart,
          currentPeriodStart: currentPeriodStart,
          currentPeriodEnd: currentPeriodEnd,
          cancelAtPeriodEnd: false
        };

        // Wrap all DB updates in a single transaction; clean up Stripe on failure
        let subscription;
        try {
          subscription = await prisma.$transaction(async (tx) => {
            // Ensure stripeCustomerId is persisted
            await tx.user.update({
              where: { id: user.id },
              data: { stripeCustomerId: stripeCustomerId }
            });

            // If an expired/cancelled subscription exists, update it; otherwise create new
            return existingSubscription
              ? await tx.subscription.update({
                  where: { id: existingSubscription.id },
                  data: subscriptionFields
                })
              : await tx.subscription.create({
                  data: { ...subscriptionFields, user: { connect: { id: user.id } } }
                });
          });
        } catch (dbError) {
          // DB transaction failed -- attempt to cancel the Stripe subscription as cleanup
          console.error('DB transaction failed, cancelling Stripe subscription:', dbError);
          try {
            await stripe.subscriptions.cancel(stripeSubscription.id);
          } catch (stripeCleanupError) {
            console.error('Failed to cancel Stripe subscription during cleanup:', stripeCleanupError);
          }
          throw dbError;
        }

        return {
          id: subscription.id,
          status: subscription.status,
          plan: priceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'Monthly Plan' : 'Yearly Plan',
          currentPeriodStart: subscription.currentPeriodStart?.toISOString() || new Date().toISOString(),
          currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() || new Date().toISOString(),
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          stripeSubscriptionId: subscription.stripeSubscriptionId
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to create subscription');
      }
    },

    // Update subscription (change plan)
    updateSubscription: async (_parent: any, args: { input: { priceId: string } }, context: any) => {
      try {
        const user = await context.getFullUser();
        if (!user?.isAuthenticated || !user?.id) {
          throw new Error('User must be authenticated');
        }

        const { priceId } = args.input;

        // Validate price ID
        const validPriceIds = [process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID, process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID];
        if (!validPriceIds.includes(priceId)) {
          throw new Error('Invalid price ID');
        }

        // Find user's active subscription
        const subscription = await prisma.subscription.findFirst({
          where: {
            userId: user.id,
            status: 'ACTIVE'
          }
        });

        if (!subscription) {
          throw new Error('No active subscription found');
        }

        if (!subscription.stripeSubscriptionId) {
          throw new Error('No Stripe subscription ID found');
        }

        // Get current Stripe subscription
        const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);

        // Determine upgrade vs downgrade for proration behavior
        const isUpgrade = priceId === process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID;
        const isDowngrade = !isUpgrade;

        // Update subscription in Stripe
        const updatedStripeSubscription = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          items: [
            {
              id: stripeSubscription.items.data[0].id,
              price: priceId,
            },
          ],
          proration_behavior: isUpgrade ? 'create_prorations' : 'none',
        });

        // Update subscription in database
        // For downgrades (yearly -> monthly), preserve the existing period dates
        // so the user keeps their yearly access until the year ends
        const updated_subscription_data = updatedStripeSubscription as any;

        const dbUpdateData: any = {
          stripePriceId: priceId,
          plan: priceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'MONTHLY' : 'YEARLY',
        };

        if (!isDowngrade) {
          // For upgrades, use Stripe's returned period dates
          dbUpdateData.currentPeriodStart = updated_subscription_data.current_period_start
            ? new Date(updated_subscription_data.current_period_start * 1000)
            : new Date();
          dbUpdateData.currentPeriodEnd = updated_subscription_data.current_period_end
            ? new Date(updated_subscription_data.current_period_end * 1000)
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);
        }
        // For downgrades, keep existing currentPeriodStart and currentPeriodEnd

        const updatedSubscription = await prisma.subscription.update({
          where: { id: subscription.id },
          data: dbUpdateData
        });

        return {
          id: updatedSubscription.id,
          status: updatedSubscription.status,
          plan: priceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'Monthly Plan' : 'Yearly Plan',
          currentPeriodStart: updatedSubscription.currentPeriodStart?.toISOString() || new Date().toISOString(),
          currentPeriodEnd: updatedSubscription.currentPeriodEnd?.toISOString() || new Date().toISOString(),
          cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd,
          stripeSubscriptionId: updatedSubscription.stripeSubscriptionId
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to update subscription');
      }
    },

    // Cancel subscription
    cancelSubscription: async (_parent: any, _args: any, context: any) => {
      try {
        const user = await context.getFullUser();
        if (!user?.isAuthenticated || !user?.id) {
          throw new Error('User must be authenticated');
        }

        // Find user's active subscription
        const subscription = await prisma.subscription.findFirst({
          where: {
            userId: user.id,
            status: 'ACTIVE'
          }
        });

        if (!subscription) {
          throw new Error('No active subscription found');
        }

        if (!subscription.stripeSubscriptionId) {
          throw new Error('No Stripe subscription ID found');
        }

        // Cancel subscription in Stripe (at period end)
        const stripeSubscription = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });

        // Update subscription in database
        const updatedSubscription = await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            cancelAtPeriodEnd: true
          }
        });

        return {
          id: updatedSubscription.id,
          status: updatedSubscription.status,
          plan: subscription.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'Monthly Plan' : 'Yearly Plan',
          currentPeriodStart: updatedSubscription.currentPeriodStart?.toISOString() || new Date().toISOString(),
          currentPeriodEnd: updatedSubscription.currentPeriodEnd?.toISOString() || new Date().toISOString(),
          cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd,
          stripeSubscriptionId: updatedSubscription.stripeSubscriptionId
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to cancel subscription');
      }
    },

    // Reactivate subscription (turn auto-renewal back on)
    reactivateSubscription: async (_parent: any, _args: any, context: any) => {
      try {
        const user = await context.getFullUser();
        if (!user?.isAuthenticated || !user?.id) {
          throw new Error('User must be authenticated');
        }

        // Find user's subscription that's set to cancel at period end
        const subscription = await prisma.subscription.findFirst({
          where: {
            userId: user.id,
            status: 'ACTIVE',
            cancelAtPeriodEnd: true
          }
        });

        if (!subscription) {
          throw new Error('No subscription to reactivate found');
        }

        if (!subscription.stripeSubscriptionId) {
          throw new Error('No Stripe subscription ID found');
        }

        // Reactivate subscription in Stripe
        const stripeSubscription = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: false,
        });

        // Update subscription in database
        const updatedSubscription = await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            cancelAtPeriodEnd: false
          }
        });

        return {
          id: updatedSubscription.id,
          status: updatedSubscription.status,
          plan: subscription.stripePriceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'Monthly Plan' : 'Yearly Plan',
          currentPeriodStart: updatedSubscription.currentPeriodStart?.toISOString() || new Date().toISOString(),
          currentPeriodEnd: updatedSubscription.currentPeriodEnd?.toISOString() || new Date().toISOString(),
          cancelAtPeriodEnd: updatedSubscription.cancelAtPeriodEnd,
          stripeSubscriptionId: updatedSubscription.stripeSubscriptionId
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Failed to reactivate subscription');
      }
    }
  }
};