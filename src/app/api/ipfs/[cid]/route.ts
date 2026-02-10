import { NextRequest, NextResponse } from 'next/server';

const GATEWAY_URL = process.env.PINATA_GATEWAY_URL || 'https://ivory-historic-penguin-632.mypinata.cloud';
const GATEWAY_TOKEN = process.env.PINATA_GATEWAY_TOKEN || '';

export async function GET(
  req: NextRequest,
  { params }: { params: { cid: string } }
) {
  const { cid } = params;

  if (!cid || !/^[a-zA-Z0-9]+$/.test(cid)) {
    return NextResponse.json({ error: 'Invalid CID' }, { status: 400 });
  }

  const url = `${GATEWAY_URL}/ipfs/${cid}${GATEWAY_TOKEN ? `?pinataGatewayToken=${GATEWAY_TOKEN}` : ''}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const body = await response.arrayBuffer();

    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}
