import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // Verify webhook secret if configured
    const webhookSecret = process.env.LIVEPEER_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers.get('livepeer-signature');
      if (!signature || signature !== webhookSecret) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const body = await req.json();
    const { event, stream } = body;

    if (!stream?.id) return NextResponse.json({ received: true });

    const dbStream = await prisma.livestream.findUnique({
      where: { livepeerStreamId: stream.id },
    });

    if (!dbStream) return NextResponse.json({ received: true });

    switch (event) {
      case 'stream.started':
        await prisma.livestream.update({
          where: { id: dbStream.id },
          data: { status: 'LIVE', startedAt: new Date() },
        });
        break;

      case 'stream.idle':
        await prisma.livestream.update({
          where: { id: dbStream.id },
          data: { status: 'IDLE' },
        });
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('LivePeer webhook error:', error);
    return NextResponse.json({ received: true });
  }
}
