import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AuthService } from '@/lib/auth';
import { deleteStream, getRtmpIngestUrl, getPlaybackUrl } from '@/lib/livepeer';

async function verifyAdmin(request: NextRequest) {
  try {
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
  } catch {
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const stream = await prisma.livestream.findUnique({
      where: { id: params.id },
    });

    if (!stream) {
      return NextResponse.json({ error: 'Stream not found' }, { status: 404 });
    }

    return NextResponse.json({
      stream: {
        ...stream,
        rtmpUrl: getRtmpIngestUrl(),
        playbackUrl: getPlaybackUrl(stream.playbackId),
      },
    });
  } catch (error) {
    console.error('Get stream error:', error);
    return NextResponse.json({ error: 'Failed to get stream' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { title, description } = await request.json();

    const stream = await prisma.livestream.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json({ stream });
  } catch (error) {
    console.error('Update stream error:', error);
    return NextResponse.json({ error: 'Failed to update stream' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const stream = await prisma.livestream.findUnique({
      where: { id: params.id },
    });

    if (!stream) {
      return NextResponse.json({ error: 'Stream not found' }, { status: 404 });
    }

    // Delete from LivePeer
    await deleteStream(stream.livepeerStreamId);

    // Update status in DB
    await prisma.livestream.update({
      where: { id: params.id },
      data: { status: 'ENDED', endedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete stream error:', error);
    return NextResponse.json({ error: 'Failed to delete stream' }, { status: 500 });
  }
}
