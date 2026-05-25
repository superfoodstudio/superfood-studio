const LIVEPEER_API_URL = 'https://livepeer.studio/api';

function getApiKey(): string {
  const key = process.env.LIVEPEER_API_KEY;
  if (!key) {
    throw new Error('LIVEPEER_API_KEY is not configured');
  }
  return key;
}

interface LivepeerStream {
  id: string;
  name: string;
  streamKey: string;
  playbackId: string;
  isActive: boolean;
}

async function livepeerFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${LIVEPEER_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LivePeer API error ${res.status}: ${body}`);
  }

  return res.json();
}

export async function createStream(title: string): Promise<LivepeerStream> {
  const data = await livepeerFetch('/stream', {
    method: 'POST',
    body: JSON.stringify({
      name: title,
      profiles: [
        { name: '720p', bitrate: 2000000, fps: 30, width: 1280, height: 720 },
        { name: '480p', bitrate: 1000000, fps: 30, width: 854, height: 480 },
        { name: '360p', bitrate: 500000, fps: 30, width: 640, height: 360 },
      ],
    }),
  });

  return {
    id: data.id,
    name: data.name,
    streamKey: data.streamKey,
    playbackId: data.playbackId,
    isActive: data.isActive || false,
  };
}

export async function getStreamStatus(livepeerStreamId: string): Promise<{ isActive: boolean }> {
  const data = await livepeerFetch(`/stream/${livepeerStreamId}`);
  return { isActive: data.isActive || false };
}

export async function deleteStream(livepeerStreamId: string): Promise<void> {
  const res = await fetch(`${LIVEPEER_API_URL}/stream/${livepeerStreamId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`LivePeer API error ${res.status}: ${body}`);
  }
}

export function getRtmpIngestUrl(): string {
  return 'rtmp://rtmp.livepeer.com/live';
}

export function getPlaybackUrl(playbackId: string): string {
  return `https://livepeercdn.studio/hls/${playbackId}/index.m3u8`;
}
