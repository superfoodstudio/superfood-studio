import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';
import { getSubscriptionPeriod, getSubscriptionStatus, getInvoicePeriod } from '@/lib/stripe-helpers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16' as Stripe.LatestApiVersion,
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  if (!endpointSecret) {
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }

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

  // Idempotency: skip already-processed events
  const existing = await prisma.webhookEvent.findUnique({
    where: { stripeEventId: event.id },
  });
  if (existing) {
    return NextResponse.json({ received: true });
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

      case 'invoice.paid':
        await handleInvoicePaid(event);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event);
        break;

      default:
        // Unhandled event type
    }

    // Record processed event
    await prisma.webhookEvent.create({
      data: { stripeEventId: event.id, type: event.type },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`Webhook handler error [${event.type}]:`, error);
    // Return 200 for application-level errors to prevent infinite retries.
    // The event is NOT recorded so it can be reprocessed if the bug is fixed
    // and Stripe retries, but we don't cause a retry storm.
    return NextResponse.json({ received: true, error: 'Handler failed' });
  }
}

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const { orderId, cartId } = session.metadata || {};

  if (!orderId) {
    console.error('No order ID in session metadata');
    return;
  }

  const sessionWithShipping = session as any;
  const shippingAddress = sessionWithShipping.shipping_details?.address ? {
    street: sessionWithShipping.shipping_details.address.line1 || '',
    city: sessionWithShipping.shipping_details.address.city || '',
    state: sessionWithShipping.shipping_details.address.state || '',
    zipCode: sessionWithShipping.shipping_details.address.postal_code || '',
    country: sessionWithShipping.shipping_details.address.country || '',
  } : undefined;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    console.error('Order not found:', orderId);
    return;
  }

  if (order.status === 'PENDING') {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'PROCESSING',
          shippingAddress: shippingAddress || undefined,
        },
      });

      for (const item of order.items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              inventory: { decrement: item.quantity },
            },
          });
        }
      }
    });
  }

  if (cartId) {
    await prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }
}

async function handlePaymentIntentSucceeded(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  const order = await prisma.order.findFirst({
    where: { stripeSessionId: paymentIntent.id },
    include: { items: true },
  });

  if (!order) {
    return;
  }

  if (order.status === 'PENDING') {
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'PROCESSING',
          updatedAt: new Date(),
        },
      });

      for (const item of order.items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              inventory: { decrement: item.quantity },
            },
          });
        }
      }
    });
  }
}

async function handlePaymentIntentFailed(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  await prisma.order.updateMany({
    where: { stripeSessionId: paymentIntent.id },
    data: {
      status: 'CANCELED',
      updatedAt: new Date(),
    },
  });
}

async function handleSubscriptionEvent(event: Stripe.Event) {
  const stripeSubscription = event.data.object as any;
  const stripeSubscriptionId = stripeSubscription.id;

  const dbSubscription = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId },
  });

  if (!dbSubscription) {
    console.error('Subscription not found:', stripeSubscriptionId);
    return;
  }

  const period = getSubscriptionPeriod(stripeSubscription);

  switch (event.type) {
    case 'customer.subscription.created':
      await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
          status: 'ACTIVE',
          ...(period && {
            startDate: new Date(period.start * 1000),
            currentPeriodStart: new Date(period.start * 1000),
            currentPeriodEnd: new Date(period.end * 1000),
          }),
        },
      });
      break;

    case 'customer.subscription.updated': {
      const updatedPriceId = stripeSubscription.items?.data?.[0]?.price?.id;
      const status = getSubscriptionStatus(stripeSubscription.status);

      const data: any = {
        status,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end ?? false,
        ...(period && {
          currentPeriodStart: new Date(period.start * 1000),
          currentPeriodEnd: new Date(period.end * 1000),
        }),
      };

      if (stripeSubscription.cancel_at_period_end && stripeSubscription.cancel_at) {
        data.endDate = new Date(stripeSubscription.cancel_at * 1000);
      }

      if (updatedPriceId) {
        data.stripePriceId = updatedPriceId;
        data.plan = updatedPriceId === process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID ? 'MONTHLY' : 'YEARLY';
      }

      await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data,
      });
      break;
    }

    case 'customer.subscription.deleted':
      await prisma.subscription.update({
        where: { id: dbSubscription.id },
        data: {
          status: 'CANCELED',
          cancelAtPeriodEnd: false,
          endDate: new Date(),
        },
      });
      break;
  }
}

async function handleInvoicePaid(event: Stripe.Event) {
  const invoice = event.data.object as any;
  const stripeSubscriptionId = invoice.subscription;

  if (!stripeSubscriptionId) return;

  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId },
  });

  if (!dbSubscription) return;

  const invoicePeriod = getInvoicePeriod(invoice);
  if (!invoicePeriod) return;

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: 'ACTIVE',
      currentPeriodStart: invoicePeriod.start,
      currentPeriodEnd: invoicePeriod.end,
    },
  });
}

async function handleInvoicePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as any;
  const subscriptionId = invoice.subscription;

  if (!subscriptionId) return;

  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
  });

  if (!dbSubscription) return;

  await prisma.subscription.update({
    where: { id: dbSubscription.id },
    data: { status: 'PAST_DUE' },
  });
}
