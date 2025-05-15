import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrivyClient } from '@privy-io/server-auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16' as Stripe.LatestApiVersion,
});

interface SubscriptionAction {
  action: 'cancel' | 'reactivate' | 'change-plan';
  planId?: 'MONTHLY' | 'YEARLY'; // Required for change-plan action
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: subscriptionId } = await params;
    
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    const authToken = authHeader?.replace('Bearer ', '');
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const privy = new PrivyClient(
      process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
      process.env.PRIVY_APP_SECRET!
    );
    
    let userId: string;
    
    try {
      const verifiedUser = await privy.verifyAuthToken(authToken);
      const userDetails = await privy.getUser(verifiedUser.userId);
      
      if (!userDetails.email?.address) {
        return NextResponse.json(
          { error: 'User email not found' },
          { status: 400 }
        );
      }
      
      const dbUser = await prisma.user.findUnique({
        where: { email: userDetails.email.address }
      });
      
      if (!dbUser) {
        return NextResponse.json(
          { error: 'User not found in database' },
          { status: 404 }
        );
      }
      
      userId = dbUser.id;
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
    
    // Fetch the subscription from the database
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    });
    
    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }
    
    // Verify ownership
    if (subscription.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized to manage this subscription' },
        { status: 403 }
      );
    }
    
    // Parse request
    const body: SubscriptionAction = await req.json();
    const { action, planId } = body;
    
    // Handle different subscription actions
    switch (action) {
      case 'cancel':
        return await handleCancelSubscription(subscription);
        
      case 'reactivate':
        return await handleReactivateSubscription(subscription);
        
      case 'change-plan':
        if (!planId) {
          return NextResponse.json(
            { error: 'Plan ID is required for plan change' },
            { status: 400 }
          );
        }
        return await handleChangePlan(subscription, planId);
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('Subscription management error:', error);
    return NextResponse.json(
      { error: 'Failed to manage subscription' },
      { status: 500 }
    );
  }
}

async function handleCancelSubscription(subscription: any) {
  if (!subscription.stripeSubscriptionId) {
    return NextResponse.json(
      { error: 'No active Stripe subscription found' },
      { status: 400 }
    );
  }
  
  try {
    // Cancel at period end in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
    
    // Update subscription status in database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { 
        status: 'CANCELED',
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}

async function handleReactivateSubscription(subscription: any) {
  if (!subscription.stripeSubscriptionId) {
    return NextResponse.json(
      { error: 'No active Stripe subscription found' },
      { status: 400 }
    );
  }
  
  // Check if the subscription can be reactivated
  if (subscription.status !== 'CANCELED') {
    return NextResponse.json(
      { error: 'Subscription is not canceled' },
      { status: 400 }
    );
  }
  
  try {
    // Reactivate in Stripe by removing the cancel_at_period_end flag
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: false,
    });
    
    // Update subscription status in database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { 
        status: 'ACTIVE',
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Subscription has been reactivated',
    });
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to reactivate subscription' },
      { status: 500 }
    );
  }
}

async function handleChangePlan(subscription: any, newPlanId: 'MONTHLY' | 'YEARLY') {
  if (!subscription.stripeSubscriptionId) {
    return NextResponse.json(
      { error: 'No active Stripe subscription found' },
      { status: 400 }
    );
  }
  
  // Check if the target plan is actually different
  if (subscription.plan === newPlanId) {
    return NextResponse.json(
      { error: 'Already subscribed to this plan' },
      { status: 400 }
    );
  }
  
  try {
    // Get the stripe price ID for the new plan
    const SUBSCRIPTION_PLANS = {
      MONTHLY: process.env.STRIPE_MONTHLY_PRICE_ID,
      YEARLY: process.env.STRIPE_YEARLY_PRICE_ID,
    };
    
    const newStripePriceId = SUBSCRIPTION_PLANS[newPlanId];
    
    if (!newStripePriceId) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      );
    }
    
    // Update the subscription in Stripe
    const updatedStripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId);
    
    // Update the subscription items
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [
        {
          id: updatedStripeSubscription.items.data[0].id,
          price: newStripePriceId,
        },
      ],
      proration_behavior: 'create_prorations',
    });
    
    // Update the subscription in the database
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        plan: newPlanId,
        stripePriceId: newStripePriceId,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: `Subscription plan changed to ${newPlanId}`,
    });
  } catch (error) {
    console.error('Error changing subscription plan:', error);
    return NextResponse.json(
      { error: 'Failed to change subscription plan' },
      { status: 500 }
    );
  }
} 