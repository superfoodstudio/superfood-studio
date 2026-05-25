import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/auth';
import { getPlaybackUrl } from '@/lib/livepeer';
import { hasLivestreamAccess } from '@/lib/stripe-helpers';

export async function GET(request: NextRequest) {
  try {
    // Verify user has active subscription
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const authService = AuthService.getInstance();
    const user = await authService.verifyToken(token);

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, subscription: { select: { status: true } } },
    });

    const hasAccess = hasLivestreamAccess(dbUser?.role || null, dbUser?.subscription?.status || null);
    if (!hasAccess) {
      return NextResponse.json({ error: 'Active subscription required' }, { status: 403 });
    }

    const activeStream = await prisma.livestream.findFirst({
      where: { status: 'LIVE' },
      orderBy: { startedAt: 'desc' },
    });

    if (!activeStream) {
      return NextResponse.json({ live: false });
    }

    return NextResponse.json({
      live: true,
      title: activeStream.title,
      description: activeStream.description,
      playbackUrl: getPlaybackUrl(activeStream.playbackId),
    });
  } catch (error) {
    console.error('Active stream error:', error);
    return NextResponse.json({ live: false });
  }
}
