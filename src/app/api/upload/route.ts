import { NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';
import { AuthService } from '@/lib/auth';

const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY!,
  pinataSecretApiKey: process.env.PINATA_SECRET_KEY!
});

export async function POST(request: Request) {
  try {
    // Verify admin access
    const authHeader = request.headers.get('authorization');
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
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Pinata
    const result = await pinata.pinFileToIPFS(buffer, {
      pinataMetadata: {
        name: file.name,
      },
    });

    return NextResponse.json({
      ipfsHash: result.IpfsHash,
      pinataUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 