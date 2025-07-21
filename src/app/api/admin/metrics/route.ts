import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PrivyClient } from '@privy-io/server-auth';

export async function GET(req: NextRequest) {
  try {
    // Verify authentication and admin role
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
    
    let userId: string | null = null;
    
    try {
      const verifiedUser = await privy.verifyAuthToken(authToken);
      const userDetails = await privy.getUser(verifiedUser.userId);
      
      if (userDetails.email?.address) {
        const dbUser = await prisma.user.findUnique({
          where: { email: userDetails.email.address }
        });
        
        if (dbUser && dbUser.role === 'ADMIN') {
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
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Calculate metrics
    const [
      totalOrders,
      completedOrders,
      pendingOrders,
      activeSubscriptions,
      revenueData
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({
        where: { status: 'DELIVERED' }
      }),
      prisma.order.count({
        where: { status: 'PENDING' }
      }),
      prisma.subscription.count({
        where: { status: 'ACTIVE' }
      }),
      prisma.order.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { total: true }
      })
    ]);

    // Get recent orders for display
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    const metrics = {
      totalOrders,
      totalRevenue: revenueData._sum.total || 0,
      activeSubscriptions,
      pendingOrders,
      completedOrders,
    };

    const formattedRecentOrders = recentOrders.map(order => ({
      id: order.id,
      customerName: order.user 
        ? `${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || 'Unknown Customer'
        : 'Unknown Customer',
      customerEmail: order.user?.email || 'unknown@example.com',
      total: order.total,
      status: order.status,
      date: order.createdAt.toISOString(),
      itemCount: 0, // We'd need to count items if needed
    }));

    return NextResponse.json({
      adminMetrics: metrics,
      recentOrders: formattedRecentOrders,
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}