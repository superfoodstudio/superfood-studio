import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/auth';
import { createStream } from '@/lib/livepeer';

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.split(' ')[1];
  const authService = AuthService.getInstance();
  const user = await authService.verifyToken(token);

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, role: true },
  });

  return dbUser?.role === 'ADMIN' ? dbUser : null;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const streams = await prisma.livestream.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ streams });
  } catch (error) {
    console.error('List streams error:', error);
    return NextResponse.json({ error: 'Failed to list streams' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { title, description } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const livepeerStream = await createStream(title);

    const stream = await prisma.livestream.create({
      data: {
        title,
        description: description || null,
        streamKey: livepeerStream.streamKey,
        playbackId: livepeerStream.playbackId,
        livepeerStreamId: livepeerStream.id,
        status: 'IDLE',
      },
    });

    return NextResponse.json({ stream });
  } catch (error) {
    console.error('Create stream error:', error);
    return NextResponse.json({ error: 'Failed to create stream' }, { status: 500 });
  }
}
