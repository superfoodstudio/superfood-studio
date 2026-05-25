import { NextRequest, NextResponse } from 'next/server';
import { existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { ipfsUrl } from '@/lib/ipfs';

const CACHE_DIR = '/tmp/video-thumbs';
const MAX_WIDTH = 960;

export async function GET(request: NextRequest) {
  const cid = request.nextUrl.searchParams.get('cid');
  const width = Math.min(parseInt(request.nextUrl.searchParams.get('w') || '640'), MAX_WIDTH);

  if (!cid || !/^[A-Za-z0-9]+$/.test(cid)) {
    return NextResponse.json({ error: 'Invalid CID' }, { status: 400 });
  }

  const cachePath = join(CACHE_DIR, `${cid}-${width}.jpg`);

  // Serve from cache if available
  if (existsSync(cachePath)) {
    const buffer = readFileSync(cachePath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  }

  // Generate thumbnail using ffmpeg
  try {
    mkdirSync(CACHE_DIR, { recursive: true });

    const videoUrl = ipfsUrl(cid);
    const { spawn } = await import('child_process');

    await new Promise<void>((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', [
        '-i', videoUrl,
        '-ss', '2',
        '-vframes', '1',
        '-vf', `scale=${width}:-1`,
        '-f', 'image2',
        '-y', cachePath,
      ], { timeout: 15000 });

      ffmpeg.on('close', (code: number) => {
        if (code === 0 && existsSync(cachePath)) {
          resolve();
        } else {
          reject(new Error(`ffmpeg exited with code ${code}`));
        }
      });

      ffmpeg.on('error', (err: Error) => reject(err));

      setTimeout(() => {
        try { ffmpeg.kill('SIGKILL'); } catch {}
      }, 15000);
    });

    const buffer = readFileSync(cachePath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
