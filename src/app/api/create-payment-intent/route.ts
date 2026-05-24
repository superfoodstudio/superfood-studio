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
  taxCalculationId?: string;
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
    const { cartItems, shippingAddress, taxCalculationId } = body;
    
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
      const product = products.find((p: any) => p.id === cartItem.productId);
      if (!product) {
        return NextResponse.json(
          { error: 'One or more products are unavailable' },
          { status: 400 }
        );
      }
      
      // Check inventory
      if (cartItem.quantity > product.inventory) {
        return NextResponse.json(
          { error: 'Insufficient inventory for one or more items' },
          { status: 400 }
        );
      }
    }
    
    // Calculate subtotal using DB prices (ignore client-sent prices)
    const subtotal = cartItems.reduce((sum, item) => {
      const product = products.find((p: any) => p.id === item.productId)!;
      return sum + (product.price * item.quantity);
    }, 0);

    // Calculate shipping and tax
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const shippingAmount = totalQuantity > 5 ? 10.00 : 5.00;
    let taxAmount = 0;

    if (taxCalculationId) {
      const taxCalc = await stripe.tax.calculations.retrieve(taxCalculationId);
      taxAmount = taxCalc.tax_amount_exclusive / 100;
    }

    const total = subtotal + shippingAmount + taxAmount;

    // Atomically validate inventory and create order
    const order = await prisma.$transaction(async (tx) => {
      for (const cartItem of cartItems) {
        const product = await tx.product.findUnique({ where: { id: cartItem.productId } });
        if (!product || cartItem.quantity > product.inventory) {
          throw new Error('Insufficient inventory');
        }
      }

      return tx.order.create({
        data: {
          userId: userId!,
          total,
          shippingAmount,
          taxAmount,
          status: 'PENDING',
          shippingAddress: shippingAddress || undefined,
          items: {
            create: cartItems.map(item => {
              const product = products.find((p: any) => p.id === item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
              };
            }),
          },
        },
      });
    });

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: 'usd',
      metadata: {
        orderId: order.id,
        userId: userId,
        shippingAmount: String(shippingAmount),
        taxAmount: String(taxAmount),
        ...(taxCalculationId ? { tax_calculation: taxCalculationId } : {}),
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