import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrivyClient } from '@privy-io/server-auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16' as Stripe.LatestApiVersion,
});

const CURRENCY = 'usd';
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';

interface CheckoutBody {
  cartId: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    const authToken = authHeader?.replace('Bearer ', '');
    let userId: string | null = null;
    
    if (authToken) {
      const privy = new PrivyClient(
        process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
        process.env.PRIVY_APP_SECRET!
      );
      
      try {
        const verifiedUser = await privy.verifyAuthToken(authToken);
        const userDetails = await privy.getUser(verifiedUser.userId);
        
        if (userDetails.email?.address) {
          const dbUser = await prisma.user.findUnique({
            where: { email: userDetails.email.address }
          });
          
          if (dbUser) {
            userId = dbUser.id;
          }
        }
      } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 }
        );
      }
    }
    
    // Parse request body
    const body: CheckoutBody = await req.json();
    const { cartId, shippingAddress, billingAddress } = body;
    
    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }
    
    // Fetch cart with items
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
    
    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart not found or is empty' },
        { status: 400 }
      );
    }
    
    // Verify cart ownership if authenticated
    if (userId && cart.userId && cart.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized access to cart' },
        { status: 403 }
      );
    }
    
    // Check inventory availability
    for (const item of cart.items) {
      if (item.quantity > item.product.inventory) {
        return NextResponse.json(
          { 
            error: 'Insufficient inventory', 
            productId: item.productId,
            productName: item.product.name,
            available: item.product.inventory 
          },
          { status: 400 }
        );
      }
    }
    
    // Calculate total
    const total = cart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    // Create a pending order in the database
    const order = await prisma.order.create({
      data: {
        userId: userId!, // We know the user is authenticated at this point
        total,
        status: 'PENDING',
        items: {
          create: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
    
    // Create line items for Stripe
    const lineItems = cart.items.map(item => {
      return {
        price_data: {
          currency: CURRENCY,
          product_data: {
            name: item.product.name,
            description: item.product.description,
            images: [item.product.photoUrl],
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      };
    });
    
    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${WEBSITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${WEBSITE_URL}/checkout/cancel?order_id=${order.id}`,
      metadata: {
        orderId: order.id,
        cartId: cart.id,
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'MX'], // Add countries you want to support
      },
    });
    
    // Update order with Stripe session ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        // Use a custom field or add to metadata
        stripeSessionId: checkoutSession.id,
      },
    });
    
    return NextResponse.json({ 
      checkoutUrl: checkoutSession.url,
      orderId: order.id,
      sessionId: checkoutSession.id
    });
    
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 