import { prisma } from '@/lib/prisma';
import { PrivyClient } from '@privy-io/server-auth';

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

async function getCurrentUserId(context: any): Promise<string | null> {
  try {
    // Use the GraphQL context user that's already authenticated
    if (context.user && context.user.isAuthenticated && context.user.id) {
      return context.user.id;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export const orderResolvers = {
  Query: {
    // Get current user's orders
    userOrders: async (_parent: any, _args: any, context: any) => {
      try {
        console.log('userOrders resolver called');
        console.log('Context user:', context.user);
        
        const userId = await getCurrentUserId(context);
        console.log('Resolved userId:', userId);
        
        if (!userId) {
          throw new Error('Authentication required');
        }

        console.log('Querying orders for userId:', userId);
        const orders = await prisma.order.findMany({
          where: {
            userId: userId,
          },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    photoUrl: true,
                    videoUrl: true,
                    price: true,
                    category: true,
                    tags: true,
                    inventory: true,
                    isActive: true,
                    stripeProductId: true,
                    stripePriceId: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        console.log('Found orders:', orders.length);
        console.log('Orders data:', orders.map(o => ({ id: o.id, userId: o.userId, status: o.status })));

        return orders.map(order => ({
          id: order.id,
          userId: order.userId,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt.toISOString(),
          updatedAt: order.updatedAt.toISOString(),
          stripeSessionId: order.stripeSessionId,
          user: order.user,
          items: order.items
            .filter(item => item.product !== null) // Filter out items with deleted products
            .map(item => ({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              product: item.product,
            })),
        }));
      } catch (error) {
        console.error('Error fetching user orders:', error);
        throw new Error('Failed to fetch orders');
      }
    },

    // Get single order by ID for current user
    userOrder: async (_parent: any, args: { orderId: string }, context: any) => {
      try {
        console.log('userOrder resolver called for orderId:', args.orderId);
        
        const userId = await getCurrentUserId(context);
        if (!userId) {
          throw new Error('Authentication required');
        }

        const order = await prisma.order.findFirst({
          where: {
            id: args.orderId,
            userId: userId, // Ensure user can only access their own orders
          },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    photoUrl: true,
                    videoUrl: true,
                    price: true,
                    category: true,
                    tags: true,
                    inventory: true,
                    isActive: true,
                    stripeProductId: true,
                    stripePriceId: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });

        if (!order) {
          return null;
        }

        return {
          id: order.id,
          userId: order.userId,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt.toISOString(),
          updatedAt: order.updatedAt.toISOString(),
          stripeSessionId: order.stripeSessionId,
          user: order.user,
          items: order.items
            .filter(item => item.product !== null) // Filter out items with deleted products
            .map(item => ({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              product: item.product,
            })),
        };
      } catch (error) {
        console.error('Error fetching user order:', error);
        throw new Error('Failed to fetch order');
      }
    },

    // Get order by payment intent ID
    orderByPaymentIntent: async (_parent: any, args: { paymentIntentId: string }, context: any) => {
      try {
        const userId = await getCurrentUserId(context);
        if (!userId) {
          throw new Error('Authentication required');
        }

        const order = await prisma.order.findFirst({
          where: {
            stripeSessionId: args.paymentIntentId,
            userId: userId,
          },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    description: true,
                    photoUrl: true,
                    videoUrl: true,
                    price: true,
                    category: true,
                    tags: true,
                    inventory: true,
                    isActive: true,
                    stripeProductId: true,
                    stripePriceId: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        });

        if (!order) {
          return null;
        }

        return {
          id: order.id,
          userId: order.userId,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt.toISOString(),
          updatedAt: order.updatedAt.toISOString(),
          stripeSessionId: order.stripeSessionId,
          user: order.user,
          items: order.items
            .filter(item => item.product !== null) // Filter out items with deleted products
            .map(item => ({
              id: item.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              product: item.product,
            })),
        };
      } catch (error) {
        console.error('Error fetching order by payment intent:', error);
        throw new Error('Failed to fetch order');
      }
    },
  },
};