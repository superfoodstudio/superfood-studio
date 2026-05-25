import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const parsed = JSON.parse(body);

    // Verify webhook signature if configured
    const webhookSecret = process.env.LIVEPEER_WEBHOOK_SECRET;
    if (webhookSecret) {
      // LivePeer uses HMAC-SHA256 signature in the 'livepeer-signature' header
      const signature = req.headers.get('livepeer-signature');
      if (signature) {
        const expectedSig = crypto
          .createHmac('sha256', webhookSecret)
          .update(body)
          .digest('hex');
        if (signature !== expectedSig) {
          console.error('LivePeer webhook signature mismatch');
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
      }
    }

    const { event, stream } = parsed;

    if (!stream?.id) return NextResponse.json({ received: true });

    const dbStream = await prisma.livestream.findUnique({
      where: { livepeerStreamId: stream.id },
    });

    if (!dbStream) {
      console.warn('LivePeer webhook: stream not found in DB:', stream.id);
      return NextResponse.json({ received: true });
    }

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
