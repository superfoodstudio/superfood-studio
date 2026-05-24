import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getPlaybackUrl } from '@/lib/livepeer';

export async function GET() {
  try {
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
