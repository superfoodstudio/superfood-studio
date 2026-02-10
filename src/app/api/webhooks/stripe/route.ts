import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16' as Stripe.LatestApiVersion,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature!,
      endpointSecret
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
  
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event);
        break;
        
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event);
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        await handleSubscriptionEvent(event);
        break;
        
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event);
        break;
        
      default:
        // Unhandled event type
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const { orderId, cartId } = session.metadata || {};
  
  if (!orderId) {
    console.error('No order ID in session metadata');
    return;
  }
  
  // Extract shipping address from Stripe session (cast to any to access shipping_details)
  const sessionWithShipping = session as any;
  const shippingAddress = sessionWithShipping.shipping_details?.address ? {
    street: sessionWithShipping.shipping_details.address.line1 || '',
    city: sessionWithShipping.shipping_details.address.city || '',
    state: sessionWithShipping.shipping_details.address.state || '',
    zipCode: sessionWithShipping.shipping_details.address.postal_code || '',
    country: sessionWithShipping.shipping_details.address.country || '',
  } : undefined;
  
  // Update order status to PROCESSING and save shipping address
  await prisma.order.update({
    where: { id: orderId },
    data: { 
      status: 'PROCESSING',
      shippingAddress: shippingAddress || undefined,
    },
  });
  
  // Reduce product inventory for each item in the order
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  
  if (!order) {
    console.error('Order not found:', orderId);
    return;
  }
  
  // Update inventory for each product
  for (const item of order.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: {
        inventory: {
          decrement: item.quantity,
        },
      },
    });
  }
  
  // If cart exists, clear it
  if (cartId) {
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
  
  // TODO: Send order confirmation email to customer
}

async function handlePaymentIntentSucceeded(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  // Find order by payment intent ID
  const order = await prisma.order.findFirst({
    where: { stripeSessionId: paymentIntent.id },
  });

  if (!order) {
    // Not all payment intents have orders (e.g. subscription payments)
    return;
  }

  // Only update to PROCESSING if still PENDING (idempotency — checkout.session.completed may have already handled this)
  if (order.status === 'PENDING') {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PROCESSING',
        updatedAt: new Date(),
      },
    });
  }
  // NOTE: Inventory decrement is handled exclusively in handleCheckoutSessionCompleted
}

async function handlePaymentIntentFailed(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  
  // Update order status to CANCELED
  await prisma.order.updateMany({
    where: {
      stripeSessionId: paymentIntent.id,
    },
    data: {
      status: 'CANCELED',
      updatedAt: new Date(),
    },
  });
  
  // TODO: Send payment failed email to customer
}

async function handleSubscriptionEvent(event: Stripe.Event) {
  // Type assertion to access the subscription properties
  const stripeSubscription = event.data.object as any;
  const stripeSubscriptionId = stripeSubscription.id;
  
  // Find the subscription in our database
  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId },
  });
  
  if (!dbSubscription) {
    console.error('Subscription not found:', stripeSubscriptionId);
    return;
  }
  
  switch (event.type) {
    case 'customer.subscription.created':
      await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
          status: 'ACTIVE',
          startDate: new Date(stripeSubscription.current_period_start * 1000),
          endDate: new Date(stripeSubscription.current_period_end * 1000),
        },
      });
      break;
      
    case 'customer.subscription.updated':
      const updatedPriceId = stripeSubscription.items?.data?.[0]?.price?.id;
      await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
          status: getSubscriptionStatus(stripeSubscription.status),
          endDate: new Date(stripeSubscription.current_period_end * 1000),
          currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
          currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end ?? false,
          ...(updatedPriceId ? {
            stripePriceId: updatedPriceId,
            plan: updatedPriceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'MONTHLY' : 'YEARLY',
          } : {}),
        },
      });
      break;
      
    case 'customer.subscription.deleted':
      await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
          status: 'CANCELED',
        },
      });
      break;
  }
  
  // TODO: Send subscription update email to customer
}

async function handleInvoicePaymentFailed(event: Stripe.Event) {
  // Use type assertion to access raw invoice data
  const invoice = event.data.object as any;
  const subscriptionId = invoice.subscription;
  
  if (!subscriptionId) {
    console.error('No subscription ID in invoice');
    return;
  }
  
  // Find subscription in our database
  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    include: { user: true },
  });
  
  if (!dbSubscription) {
    console.error('Subscription not found:', subscriptionId);
    return;
  }
  
  // TODO: Send payment failed email to customer
}

function getSubscriptionStatus(stripeStatus: string): 'ACTIVE' | 'CANCELED' | 'EXPIRED' {
  switch (stripeStatus) {
    case 'active':
    case 'trialing':
      return 'ACTIVE';
    case 'canceled':
      return 'CANCELED';
    case 'past_due':
    case 'unpaid':
    case 'incomplete':
    case 'incomplete_expired':
    default:
      return 'EXPIRED';
  }
} 