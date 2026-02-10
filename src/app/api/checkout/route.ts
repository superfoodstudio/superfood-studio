import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrivyClient } from '@privy-io/server-auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16' as Stripe.LatestApiVersion,
});

const CURRENCY = 'usd';
const WEBSITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || 'http://localhost:3000';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  productName?: string;
  productPhoto?: string;
}

interface CheckoutBody {
  cartItems: CartItem[];
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
    const { cartItems, shippingAddress, billingAddress } = body;
    
    // Authentication is required for checkout
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required for checkout' },
        { status: 401 }
      );
    }
    
    // Validate cart items
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }
    
    // Fetch products to validate and get current data
    const productIds = cartItems.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { 
        id: { in: productIds },
        isArchived: false // Only fetch non-archived products
      }
    });
    
    // Create cart-like structure using DB prices (ignore client-sent prices)
    const cartWithProducts = {
      items: cartItems.map(cartItem => {
        const product = products.find((p: any) => p.id === cartItem.productId);
        if (!product) {
          throw new Error(`Product ${cartItem.productId} not found or archived`);
        }
        return {
          productId: cartItem.productId,
          quantity: cartItem.quantity,
          price: product.price, // Use DB price, not client-sent price
          product: product
        };
      })
    };
    
    // Calculate total
    const total = cartWithProducts.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Atomically validate inventory and create order in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Re-validate inventory inside transaction
      for (const item of cartWithProducts.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product || item.quantity > product.inventory) {
          throw new Error('Insufficient inventory');
        }
      }

      // Create order
      return tx.order.create({
        data: {
          userId: userId!,
          total,
          status: 'PENDING',
          shippingAddress: shippingAddress || undefined,
          items: {
            create: cartWithProducts.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
    });
    
    // Create line items for Stripe
    const lineItems = cartWithProducts.items.map(item => {
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