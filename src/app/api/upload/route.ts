import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';
import { AuthService } from '@/lib/auth';
import { Readable } from 'stream';

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_KEY!
);

function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

async function uploadToIPFS(buffer: Buffer, filename: string): Promise<string> {
  const stream = bufferToStream(buffer);
  const options = {
    pinataMetadata: { name: filename },
    pinataOptions: { cidVersion: 1 as const },
  };

  try {
    const result = await pinata.pinFileToIPFS(stream, options);
    return `ipfs://${result.IpfsHash}`;
  } catch (error) {
    console.error('Failed to upload to IPFS:', error);
    throw new Error('Failed to upload file.');
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify admin access
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const authService = AuthService.getInstance();
    const user = await authService.verifyToken(token);
    const role = await authService.getUserRole(user.email);

    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle file upload
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to Buffer
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    const filename = file.name || 'uploaded_file';

    // Upload to Pinata
    const ipfsUrl = await uploadToIPFS(buffer, filename);

    return NextResponse.json({ url: ipfsUrl }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof Error && error.message === 'Failed to upload file.') {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 