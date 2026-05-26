import { NextRequest, NextResponse } from 'next/server';

const GATEWAY_URL = process.env.NEXT_PUBLIC_PINATA_GATEWAY_URL || 'https://ivory-historic-penguin-632.mypinata.cloud';
const GATEWAY_TOKEN = process.env.NEXT_PUBLIC_PINATA_GATEWAY_TOKEN || '';

export async function GET(
  req: NextRequest,
  { params }: { params: { cid: string } }
) {
  const { cid } = params;

  if (!cid || !/^[a-zA-Z0-9]+$/.test(cid)) {
    return NextResponse.json({ error: 'Invalid CID' }, { status: 400 });
  }

  const tokenParam = GATEWAY_TOKEN ? `?pinataGatewayToken=${GATEWAY_TOKEN}` : '';
  const url = `${GATEWAY_URL}/ipfs/${cid}${tokenParam}`;

  try {
    // Pass through range headers for video streaming
    const headers: Record<string, string> = {};
    const range = req.headers.get('range');
    if (range) headers['Range'] = range;

    const response = await fetch(url, { headers });

    if (!response.ok && response.status !== 206) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentLength = response.headers.get('content-length');
    const contentRange = response.headers.get('content-range');
    const acceptRanges = response.headers.get('accept-ranges');

    const responseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    };

    if (contentLength) responseHeaders['Content-Length'] = contentLength;
    if (contentRange) responseHeaders['Content-Range'] = contentRange;
    if (acceptRanges) responseHeaders['Accept-Ranges'] = acceptRanges;

    // Stream the response body through
    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}
