import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const authService = AuthService.getInstance();
    const user = await authService.verifyToken(token);

    // Get user with subscription
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { subscription: true }
    });

    return NextResponse.json({
      user: {
        id: dbUser?.id,
        email: dbUser?.email,
        role: dbUser?.role,
      },
      subscription: dbUser?.subscription,
      debug: {
        hasSubscription: !!dbUser?.subscription,
        subscriptionStatus: dbUser?.subscription?.status,
        isActive: dbUser?.subscription?.status === 'ACTIVE'
      }
    });
  } catch (error) {
    console.error('Debug user status error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}