import { Readable } from 'stream';
import pinataSDK from '@pinata/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { PrivyClient } from '@privy-io/server-auth';
import sharp from 'sharp';

// Check if Pinata credentials are available
if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
  console.error('Missing Pinata credentials:', {
    hasApiKey: !!process.env.PINATA_API_KEY,
    hasSecretKey: !!process.env.PINATA_SECRET_API_KEY
  });
}

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
);

// Maximum file size in bytes (2GB - supports HD video uploads)
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024;

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/quicktime',
];

function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

async function uploadToIPFS(buffer: Buffer, filename: string): Promise<string> {
  // Early check for credentials
  if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
    throw new Error('Pinata API credentials are not configured. Please set PINATA_API_KEY and PINATA_SECRET_API_KEY in your environment variables.');
  }

  const fileStream = bufferToStream(buffer);
  const options = {
    pinataMetadata: { name: filename },
    pinataOptions: { cidVersion: 1 as const },
  };

  try {
    const result = await pinata.pinFileToIPFS(fileStream, options);
    return result.IpfsHash;
  } catch (error) {
    console.error('Failed to upload to IPFS:', {
      error: error instanceof Error ? error.message : error,
      filename,
      bufferSize: buffer.length,
      hasApiKey: !!process.env.PINATA_API_KEY,
      hasSecretKey: !!process.env.PINATA_SECRET_API_KEY
    });
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function generateVideoThumbnail(videoCid: string): Promise<string> {
  const { spawn } = await import('child_process');
  const { existsSync, mkdirSync, readFileSync, unlinkSync } = await import('fs');
  const { join } = await import('path');
  const { ipfsUrl } = await import('@/lib/ipfs');

  const tmpDir = '/tmp/video-thumbs';
  mkdirSync(tmpDir, { recursive: true });
  const tmpPath = join(tmpDir, `upload-${videoCid}.jpg`);

  const videoUrl = ipfsUrl(videoCid);

  await new Promise<void>((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', videoUrl,
      '-ss', '2',
      '-vframes', '1',
      '-vf', 'scale=640:-1',
      '-f', 'image2',
      '-y', tmpPath,
    ], { timeout: 30000 });

    ffmpeg.on('close', (code: number) => {
      if (code === 0 && existsSync(tmpPath)) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
    ffmpeg.on('error', reject);

    setTimeout(() => { try { ffmpeg.kill('SIGKILL'); } catch {} }, 30000);
  });

  // Optimize with sharp and upload
  const thumbBuffer = await sharp(readFileSync(tmpPath))
    .resize({ width: 640, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer() as Buffer;

  const thumbnailCid = await uploadToIPFS(thumbBuffer, `thumb-${videoCid}.jpg`);

  // Clean up temp file
  try { unlinkSync(tmpPath); } catch {}

  return thumbnailCid;
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    const authToken = authHeader?.replace('Bearer ', '') || req.cookies.get('privy-token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const privy = new PrivyClient(
      process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
      process.env.PRIVY_APP_SECRET!
    );

    try {
      await privy.verifyAuthToken(authToken);
    } catch (error) {
      console.error('Authentication error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large (max 2GB)' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    let buffer: Buffer = Buffer.from(arrayBuffer);
    let filename = file.name || 'uploaded_file';

    // Process images to optimize them
    if (file.type.startsWith('image/')) {
      buffer = await sharp(buffer)
        .resize({
          width: 1200,
          height: 1200,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer() as Buffer;
      filename = filename.replace(/\.[^/.]+$/, '.jpg');
    }

    const cid = await uploadToIPFS(buffer, filename);

    // For videos, generate a thumbnail and upload it too
    let thumbnailCid: string | null = null;
    if (file.type.startsWith('video/')) {
      try {
        thumbnailCid = await generateVideoThumbnail(cid);
      } catch (err) {
        console.warn('Thumbnail generation failed:', err);
      }
    }

    return NextResponse.json({
      cid,
      ...(thumbnailCid ? { thumbnailCid } : {}),
      success: true,
    }, { status: 200 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({
      error: 'Failed to upload file to IPFS.',
    }, { status: 500 });
  }
}
