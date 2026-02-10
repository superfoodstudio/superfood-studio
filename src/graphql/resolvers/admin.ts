import { prisma } from '@/lib/prisma';
import { GraphQLContext } from '../context';
import Stripe from 'stripe';

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-08-16' as Stripe.LatestApiVersion,
  });
}

async function requireAdmin(context: GraphQLContext) {
  const user = await context.getFullUser();
  if (!user?.isAuthenticated || user.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  return user;
}

export const adminResolvers = {
  Query: {
    // Admin dashboard metrics
    adminMetrics: async (_parent: any, _args: any, context: GraphQLContext) => {
      await requireAdmin(context);
      try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get total orders count
        const totalOrders = await prisma.order.count();

        // Get order revenue from last 30 days (non-canceled)
        const orderRevenueResult = await prisma.order.aggregate({
          where: {
            status: { in: ['PENDING', 'PROCESSING', 'DELIVERED'] as any },
            createdAt: { gte: thirtyDaysAgo }
          },
          _sum: {
            total: true
          }
        });

        // Get subscription revenue from Stripe for active subscriptions
        let subscriptionRevenue = 0;
        if (process.env.STRIPE_SECRET_KEY) {
          try {
            const stripe = getStripe();
            const activeSubs = await prisma.subscription.findMany({
              where: { status: 'ACTIVE' },
              select: { stripeSubscriptionId: true }
            });
            for (const sub of activeSubs) {
              if (sub.stripeSubscriptionId) {
                try {
                  const stripeSub = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
                  const amount = stripeSub.items.data[0]?.price?.unit_amount || 0;
                  subscriptionRevenue += amount / 100; // cents to dollars
                } catch {
                  // Individual subscription fetch failed, skip
                }
              }
            }
          } catch (e) {
            console.error('Failed to fetch subscription revenue from Stripe:', e);
          }
        }

        const totalRevenue = (orderRevenueResult._sum.total || 0) + subscriptionRevenue;

        // Get active subscriptions count
        const activeSubscriptions = await prisma.subscription.count({
          where: {
            status: 'ACTIVE'
          }
        });

        // Get pending orders count
        const pendingOrders = await prisma.order.count({
          where: {
            status: 'PENDING'
          }
        });

        return {
          totalOrders,
          totalRevenue,
          activeSubscriptions,
          pendingOrders
        };
      } catch (error) {
        console.error(error);
        return {
          totalOrders: 0,
          totalRevenue: 0,
          activeSubscriptions: 0,
          pendingOrders: 0
        };
      }
    },

    // Recent orders for admin dashboard
    recentOrders: async (_parent: any, args: { limit?: number }, context: GraphQLContext) => {
      await requireAdmin(context);
      try {
        const limit = args.limit || 5;
        
        const orders = await prisma.order.findMany({
          take: limit,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            },
            items: {
              include: {
                product: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        });

        return orders.map(order => ({
          id: order.id,
          customerName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email,
          customerEmail: order.user.email,
          total: order.total,
          status: order.status,
          date: order.createdAt.toISOString(),
          itemCount: order.items.length
        }));
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    // Single order for admin management
    adminOrder: async (_parent: any, args: { orderId: string }, context: GraphQLContext) => {
      await requireAdmin(context);
      try {
        const order = await prisma.order.findUnique({
          where: { id: args.orderId },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            },
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
          }
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
        console.error(error);
        throw new Error('Failed to fetch order');
      }
    },

    // All orders for admin management
    adminOrders: async (_parent: any, args: { limit?: number; offset?: number }, context: GraphQLContext) => {
      await requireAdmin(context);
      try {
        const limit = args.limit || 50;
        const offset = args.offset || 0;
        
        const orders = await prisma.order.findMany({
          skip: offset,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            },
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    photoUrl: true
                  }
                }
              }
            }
          }
        });

        return orders.map(order => ({
          id: order.id,
          customerName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email,
          customerEmail: order.user.email,
          total: order.total,
          status: order.status,
          date: order.createdAt.toISOString(),
          items: order.items.map(item => ({
            id: item.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.price,
            photoUrl: item.product.photoUrl
          }))
        }));
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    // Admin orders connection for infinite scrolling
    adminOrdersConnection: async (
      _parent: any,
      { first = 10, after, status }: { first?: number; after?: string; status?: string },
      context: GraphQLContext
    ) => {
      await requireAdmin(context);
      try {
        const where: any = {};
        
        // Add status filter if provided
        if (status) {
          where.status = status;
        }
        
        // Add cursor-based pagination
        if (after) {
          where.id = { lt: after }; // Use 'lt' for descending order (newest first)
        }

        const orders = await prisma.order.findMany({
          where,
          take: first + 1, // Take one extra to check if there are more
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            },
            items: {
              include: {
                product: {
                  select: {
                    name: true,
                    photoUrl: true
                  }
                }
              }
            }
          }
        });

        const hasNextPage = orders.length > first;
        const nodes = hasNextPage ? orders.slice(0, -1) : orders;

        const edges = nodes.map((order) => ({
          cursor: order.id,
          node: {
            id: order.id,
            customerName: `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.email,
            customerEmail: order.user.email,
            total: order.total,
            status: order.status,
            date: order.createdAt.toISOString(),
            shippingAddress: order.shippingAddress,
            items: order.items.map(item => ({
              id: item.id,
              productName: item.product.name,
              quantity: item.quantity,
              price: item.price,
              photoUrl: item.product.photoUrl
            }))
          }
        }));

        return {
          edges,
          pageInfo: {
            hasNextPage,
            hasPreviousPage: !!after,
            startCursor: edges.length > 0 ? edges[0].cursor : null,
            endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
          }
        };
      } catch (error) {
        console.error(error);
        return {
          edges: [],
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null
          }
        };
      }
    }
  },

  Mutation: {
    // Update order status
    updateOrderStatus: async (_parent: any, args: { orderId: string; status: string }, context: GraphQLContext) => {
      await requireAdmin(context);
      try {
        const { orderId, status } = args;
        
        // Validate status
        const validStatuses = ['PENDING', 'PROCESSING', 'DELIVERED', 'CANCELED'];
        if (!validStatuses.includes(status)) {
          throw new Error('Invalid order status');
        }

        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: { status: status as any },
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });

        return {
          id: updatedOrder.id,
          customerName: `${updatedOrder.user.firstName || ''} ${updatedOrder.user.lastName || ''}`.trim() || updatedOrder.user.email,
          customerEmail: updatedOrder.user.email,
          total: updatedOrder.total,
          status: updatedOrder.status,
          date: updatedOrder.createdAt.toISOString()
        };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to update order status');
      }
    }
  }
};