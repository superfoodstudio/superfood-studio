import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrivyClient } from '@privy-io/server-auth';
import Stripe from 'stripe';
import { AuthService } from '@/lib/auth';
import { SubscriptionStatus } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16' as Stripe.LatestApiVersion,
});

const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';

// Assuming you have predefined subscription plans in Stripe
const SUBSCRIPTION_PLANS = {
  MONTHLY: process.env.STRIPE_MONTHLY_PRICE_ID,
  YEARLY: process.env.STRIPE_YEARLY_PRICE_ID,
};

interface SubscriptionBody {
  planId: string; // Should be 'MONTHLY' or 'YEARLY'
}

export async function GET(request: NextRequest) {
  try {
    // Extract the authorization token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
      const authService = AuthService.getInstance();
      const user = await authService.verifyToken(token);

      // Get the user's subscription details
      let subscription = await prisma.subscription.findUnique({
        where: { userId: user.id },
      });

      // Check if subscription has expired (currentPeriodEnd < now)
      if (
        subscription &&
        subscription.status === 'ACTIVE' &&
        subscription.currentPeriodEnd &&
        subscription.currentPeriodEnd < new Date()
      ) {
        subscription = await prisma.subscription.update({
          where: { id: subscription.id },
          data: { status: 'EXPIRED' },
        });
      }

      return NextResponse.json({ subscription: subscription || null });
    } catch (authError) {
      console.error('Auth error in subscription GET:', authError);
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }
  } catch (error) {
    console.error('Subscription GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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
    let userEmail: string;
    
    try {
      const verifiedUser = await privy.verifyAuthToken(authToken);
      const userDetails = await privy.getUser(verifiedUser.userId);
      
      if (!userDetails.email?.address) {
        return NextResponse.json(
          { error: 'User email not found' },
          { status: 400 }
        );
      }
      
      userEmail = userDetails.email.address;
      
      const dbUser = await prisma.user.findUnique({
        where: { email: userEmail },
        include: { subscription: true },
      });
      
      if (!dbUser) {
        return NextResponse.json(
          { error: 'User not found in database' },
          { status: 404 }
        );
      }
      
      userId = dbUser.id;
      
      // Check if user already has an active subscription
      if (dbUser.subscription && dbUser.subscription.status === 'ACTIVE') {
        return NextResponse.json(
          { error: 'User already has an active subscription' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body: SubscriptionBody = await req.json();
    const { planId } = body;
    
    // Validate plan ID
    if (!planId || !SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]) {
      return NextResponse.json(
        { error: 'Invalid subscription plan' },
        { status: 400 }
      );
    }
    
    const stripePriceId = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];
    
    // Get or create Stripe customer
    let stripeCustomerId: string;
    const existingCustomer = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });
    
    if (existingCustomer.data.length > 0) {
      stripeCustomerId = existingCustomer.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          userId,
        },
      });
      stripeCustomerId = newCustomer.id;
    }
    
    // Create a subscription checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${WEBSITE_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${WEBSITE_URL}/subscription/cancel`,
      metadata: {
        userId,
        planId,
      },
    });
    
    // Create a pending subscription in the database (PENDING until payment confirmed by webhook)
    await prisma.subscription.create({
      data: {
        userId,
        status: SubscriptionStatus.PENDING,
        plan: planId as 'MONTHLY' | 'YEARLY',
        startDate: new Date(),
        stripePriceId,
        stripeSubscriptionId: '', // Will be updated by webhook
      },
    });
    
    return NextResponse.json({ 
      checkoutUrl: session.url,
      sessionId: session.id,
    });
    
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
} 