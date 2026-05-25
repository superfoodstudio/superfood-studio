import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

function verifySignature(body: string, signatureHeader: string, secret: string): boolean {
  // Format: t=<timestamp>,v1=<hmac_hex>
  const parts = signatureHeader.split(',');
  const sigPart = parts.find(p => p.startsWith('v1='));

  if (!sigPart) return false;

  const signature = sigPart.slice(3); // remove 'v1='

  // LivePeer HMAC-SHA256 signs the raw body only
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSig, 'hex')
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    // Verify webhook signature if configured
    const webhookSecret = process.env.LIVEPEER_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signatureHeader = req.headers.get('Livepeer-Signature') || req.headers.get('livepeer-signature');
      if (!signatureHeader) {
        console.error('LivePeer webhook: missing Livepeer-Signature header');
        return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
      }

      try {
        if (!verifySignature(body, signatureHeader, webhookSecret)) {
          console.error('LivePeer webhook: signature verification failed');
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
      } catch (e) {
        console.error('LivePeer webhook: signature verification error:', e);
        return NextResponse.json({ error: 'Signature error' }, { status: 401 });
      }
    }

    const parsed = JSON.parse(body);
    const event = parsed.event;
    // LivePeer sends the stream data as either 'stream' or 'event_object'
    const streamData = parsed.stream || parsed.event_object;

    if (!streamData?.id) {
      console.warn('LivePeer webhook: no stream ID in payload, event:', event);
      return NextResponse.json({ received: true });
    }

    const dbStream = await prisma.livestream.findUnique({
      where: { livepeerStreamId: streamData.id },
    });

    if (!dbStream) {
      console.warn('LivePeer webhook: stream not found in DB:', streamData.id);
      return NextResponse.json({ received: true });
    }

    switch (event) {
      case 'stream.started':
        await prisma.livestream.update({
          where: { id: dbStream.id },
          data: { status: 'LIVE', startedAt: new Date() },
        });
        console.log('LivePeer: stream started:', dbStream.title);
        break;

      case 'stream.idle':
        await prisma.livestream.update({
          where: { id: dbStream.id },
          data: { status: 'IDLE' },
        });
        console.log('LivePeer: stream idle:', dbStream.title);
        break;

      default:
        console.log('LivePeer webhook: unhandled event:', event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('LivePeer webhook error:', error);
    return NextResponse.json({ received: true });
  }
}
