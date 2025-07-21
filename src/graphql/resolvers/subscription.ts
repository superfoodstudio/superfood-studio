import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export const subscriptionResolvers = {
  Query: {
    // Create setup intent for payment method collection
    createSetupIntent: async (_parent: any, _args: any, context: any) => {
      try {
        console.log('CreateSetupIntent called with context keys:', Object.keys(context));
        const { user } = context;
        console.log('User from context:', JSON.stringify(user, null, 2));
        
        if (!user?.isAuthenticated || !user?.id) {
          console.log('Authentication failed:', { isAuthenticated: user?.isAuthenticated, id: user?.id });
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
        console.error('Error creating setup intent:', error);
        console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        throw error; // Throw the original error instead of a generic one
      }
    },

    // Get user's current subscription
    userSubscription: async (_parent: any, _args: any, context: any) => {
      try {
        const { user } = context;
        if (!user?.isAuthenticated || !user?.id) {
          return null;
        }

        // Find user's active subscription
        const subscription = await prisma.subscription.findFirst({
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
        console.error('Error fetching user subscription:', error);
        return null;
      }
    },

    // Get user's payment methods
    userPaymentMethods: async (_parent: any, _args: any, context: any) => {
      try {
        const { user } = context;
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

        // Get payment methods from Stripe
        const paymentMethods = await stripe.paymentMethods.list({
          customer: dbUser.stripeCustomerId,
          type: 'card',
        });

        return paymentMethods.data.map(pm => ({
          id: pm.id,
          brand: pm.card?.brand || 'unknown',
          last4: pm.card?.last4 || '0000',
          expMonth: pm.card?.exp_month || 1,
          expYear: pm.card?.exp_year || 2000,
          isDefault: false // We'll need to get this from the customer's default payment method
        }));
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        return [];
      }
    }
  },

  Mutation: {
    // Create a new subscription
    createSubscription: async (_parent: any, args: { input: { priceId: string; paymentMethodId: string } }, context: any) => {
      try {
        console.log('CreateSubscription called with context keys:', Object.keys(context));
        const { user } = context;
        console.log('User from context:', JSON.stringify(user, null, 2));
        console.log('User isAuthenticated:', user?.isAuthenticated);
        console.log('User id:', user?.id);
        console.log('User email:', user?.email);
        
        if (!user?.isAuthenticated || !user?.id) {
          console.log('Authentication failed:', { 
            isAuthenticated: user?.isAuthenticated, 
            id: user?.id,
            userKeys: user ? Object.keys(user) : 'no user object' 
          });
          throw new Error('User must be authenticated');
        }

        const { priceId, paymentMethodId } = args.input;

        // Validate price ID
        const validPriceIds = [process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID, process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID];
        if (!validPriceIds.includes(priceId)) {
          throw new Error('Invalid price ID');
        }

        // Check if user already has an active subscription
        const existingSubscription = await prisma.subscription.findFirst({
          where: {
            userId: user.id,
            status: 'ACTIVE'
          }
        });

        if (existingSubscription) {
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

        // Save subscription to database
        const subscription = await prisma.subscription.create({
          data: {
            userId: user.id,
            stripeSubscriptionId: stripeSubscription.id,
            stripePriceId: priceId,
            status: 'ACTIVE',
            plan: priceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'MONTHLY' : 'YEARLY',
            startDate: new Date((stripeSubscription as any).current_period_start * 1000),
            currentPeriodStart: new Date((stripeSubscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((stripeSubscription as any).current_period_end * 1000),
            cancelAtPeriodEnd: false
          }
        });

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
        console.error('Error creating subscription:', error);
        throw new Error('Failed to create subscription');
      }
    },

    // Update subscription (change plan)
    updateSubscription: async (_parent: any, args: { input: { priceId: string } }, context: any) => {
      try {
        const { user } = context;
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

        // Update subscription in Stripe
        const updatedStripeSubscription = await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          items: [
            {
              id: stripeSubscription.items.data[0].id,
              price: priceId,
            },
          ],
        });

        // Update subscription in database
        const updatedSubscription = await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            stripePriceId: priceId,
            currentPeriodStart: new Date((updatedStripeSubscription as any).current_period_start * 1000),
            currentPeriodEnd: new Date((updatedStripeSubscription as any).current_period_end * 1000)
          }
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
        console.error('Error updating subscription:', error);
        throw new Error('Failed to update subscription');
      }
    },

    // Cancel subscription
    cancelSubscription: async (_parent: any, _args: any, context: any) => {
      try {
        const { user } = context;
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
        console.error('Error canceling subscription:', error);
        throw new Error('Failed to cancel subscription');
      }
    },

    // Reactivate subscription (turn auto-renewal back on)
    reactivateSubscription: async (_parent: any, _args: any, context: any) => {
      try {
        const { user } = context;
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
        console.error('Error reactivating subscription:', error);
        throw new Error('Failed to reactivate subscription');
      }
    }
  }
};