'use client';

import { useState, useEffect, useRef } from 'react';
import { View, Text } from 'reshaped';

function HlsPlayer({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = url;
    } else {
      // Use hls.js for other browsers
      import('hls.js').then(({ default: Hls }) => {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
        }
      });
    }
  }, [url]);

  return (
    <View attributes={{ style: { position: 'relative', paddingTop: '56.25%', backgroundColor: '#000', borderRadius: '2px', overflow: 'hidden' } }}>
      <video
        ref={videoRef}
        controls
        autoPlay
        playsInline
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    </View>
  );
}

interface ActiveStream {
  live: boolean;
  title?: string;
  description?: string;
  playbackUrl?: string;
}

export default function LivestreamPage() {
  const [stream, setStream] = useState<ActiveStream | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkStream() {
      try {
        const res = await fetch('/api/livestream/active');
        if (res.ok) {
          const data = await res.json();
          setStream(data);
        }
      } catch {}
      finally { setLoading(false); }
    }

    checkStream();
    const interval = setInterval(checkStream, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View direction="column" align="center" justify="center" padding={20} attributes={{ style: { minHeight: '60vh' } }}>
        <Text attributes={{ style: { color: '#9ca3af', fontSize: '14px' } }}>Loading...</Text>
      </View>
    );
  }

  if (!stream?.live) {
    return (
      <View direction="column" align="center" justify="center" padding={20} attributes={{ style: { minHeight: '60vh' } }}>
        <Text variant="featured-2" weight="bold" attributes={{ style: { color: '#8a8a8a', fontSize: '14px', letterSpacing: '1.2px', marginBottom: '8px' } }}>
          NO LIVE STREAM
        </Text>
        <Text attributes={{ style: { color: '#9ca3af', fontSize: '14px' } }}>
          Check back later for live content.
        </Text>
      </View>
    );
  }

  return (
    <View direction="column" gap={6} padding={10} attributes={{ style: { maxWidth: '900px', margin: '0 auto' } }}>
      <View direction="row" align="center" gap={3}>
        <View attributes={{ style: { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#22c55e', animation: 'pulse 2s infinite' } }} />
        <Text variant="featured-2" weight="bold" attributes={{ style: { color: '#8a8a8a', fontSize: '14px', letterSpacing: '1.2px' } }}>
          LIVE
        </Text>
      </View>

      {stream.title && (
        <Text variant="title-3" weight="bold">{stream.title}</Text>
      )}

      <HlsPlayer url={stream.playbackUrl!} />

      {stream.description && (
        <Text attributes={{ style: { color: '#6b7280', fontSize: '14px' } }}>
          {stream.description}
        </Text>
      )}
    </View>
  );
}
