import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrivyClient } from '@privy-io/server-auth';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-08-16' as Stripe.LatestApiVersion,
});

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  productName?: string;
  productPhoto?: string;
}

interface CreatePaymentIntentBody {
  cartItems: CartItem[];
  shippingAddress?: {
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
    const body: CreatePaymentIntentBody = await req.json();
    const { cartItems, shippingAddress } = body;
    
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
    
    // Validate all products exist
    for (const cartItem of cartItems) {
      const product = products.find(p => p.id === cartItem.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product ${cartItem.productId} not found or archived` },
          { status: 400 }
        );
      }
      
      // Check inventory
      if (cartItem.quantity > product.inventory) {
        return NextResponse.json(
          { 
            error: 'Insufficient inventory', 
            productId: cartItem.productId,
            productName: product.name,
            available: product.inventory 
          },
          { status: 400 }
        );
      }
    }
    
    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Create a pending order in the database
    const order = await prisma.order.create({
      data: {
        userId: userId!,
        total,
        status: 'PENDING',
        shippingAddress: shippingAddress || undefined,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
    
    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        userId: userId,
      },
    });
    
    // Update order with Stripe payment intent ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripeSessionId: paymentIntent.id,
      },
    });
    
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
    });
    
  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}