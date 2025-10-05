import { prisma } from '@/lib/prisma';
import { PrivyClient } from '@privy-io/server-auth';
import { paginateQuery, CursorPaginationArgs } from '@/lib/pagination';

const privy = new PrivyClient(
  process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  process.env.PRIVY_APP_SECRET!
);

async function getCurrentUserId(context: any): Promise<string | null> {
  try {
    // First check if we have basic auth
    if (!context.user?.isAuthenticated) {
      return null;
    }

    // If we don't have full user data, fetch it lazily
    if (!context.user.id && context.getFullUser) {
      const fullUser = await context.getFullUser();
      return fullUser.isAuthenticated ? fullUser.id || null : null;
    }
    
    return context.user.id || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export const orderResolvers = {
  Query: {
    // Get current user's orders with pagination
    userOrders: async (_parent: any, args: CursorPaginationArgs, context: any) => {
      try {
        console.log('userOrders resolver called');
        console.log('Context user:', context.user);
        
        const userId = await getCurrentUserId(context);
        console.log('Resolved userId:', userId);
        
        if (!userId) {
          throw new Error('Authentication required');
        }

        console.log('Querying orders for userId:', userId);
        
        // Use pagination utility with custom query to include relations
        const paginatedOrders = await paginateQuery(
          {
            findMany: async (queryOptions: any) => {
              return prisma.order.findMany({
                ...queryOptions,
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
            }
          },
          args,
          { userId },
          {
            cursorField: 'createdAt',
            defaultLimit: 10,
            maxLimit: 50
          }
        );

        console.log('Found orders:', paginatedOrders.edges.length);
        console.log('Orders data:', paginatedOrders.edges.map(e => ({ id: (e.node as any).id, userId: (e.node as any).userId, status: (e.node as any).status })));

        // Transform the paginated result to match expected format
        return {
          ...paginatedOrders,
          edges: paginatedOrders.edges.map(edge => {
            const order = edge.node as any;
            return {
              ...edge,
              node: {
                id: order.id,
                userId: order.userId,
                total: order.total,
                status: order.status,
                createdAt: order.createdAt.toISOString(),
                updatedAt: order.updatedAt.toISOString(),
                stripeSessionId: order.stripeSessionId,
                shippingAddress: order.shippingAddress,
                user: order.user,
                items: order.items
                  .filter((item: any) => item.product !== null) // Filter out items with deleted products
                  .map((item: any) => ({
                    id: item.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price,
                    product: item.product,
                  })),
              }
            };
          })
        };
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
          shippingAddress: order.shippingAddress,
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
          shippingAddress: order.shippingAddress,
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