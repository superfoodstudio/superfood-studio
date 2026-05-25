'use client';

import { useState, useEffect } from 'react';
import { View, Text, Card } from 'reshaped';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';

interface StreamInfo {
  live: boolean;
  title?: string;
  description?: string;
  playbackId?: string;
  thumbnailUrl?: string;
}

export function LiveBanner() {
  const { getAccessToken, authenticated } = usePrivy();
  const [stream, setStream] = useState<StreamInfo | null>(null);

  useEffect(() => {
    if (!authenticated) return;

    async function checkStream() {
      try {
        const token = await getAccessToken();
        const res = await fetch('/api/livestream/active', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setStream(data);
        }
      } catch {}
    }

    checkStream();
    const interval = setInterval(checkStream, 30000);
    return () => clearInterval(interval);
  }, [authenticated, getAccessToken]);

  if (!stream?.live || !stream.playbackId) return null;

  return (
    <View padding={4}>
      <Link href="/livestream" style={{ textDecoration: 'none' }}>
        <Card
          padding={0}
          attributes={{
            style: {
              overflow: 'hidden',
              borderRadius: '12px',
              cursor: 'pointer',
              maxWidth: '700px',
              margin: '0 auto',
            },
          }}
        >
          <View direction={{ s: 'column', m: 'row' }} align="stretch">
            {/* Live preview thumbnail */}
            <View
              attributes={{
                style: {
                  flex: '0 0 50%',
                  position: 'relative',
                  minHeight: '200px',
                  backgroundColor: '#000',
                  overflow: 'hidden',
                },
              }}
            >
              {stream.thumbnailUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={stream.thumbnailUrl}
                  alt={stream.title || 'Live'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <View
                  align="center"
                  justify="center"
                  attributes={{
                    style: {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'var(--rs-color-lavender)',
                    }
                  }}
                >
                  <Text variant="featured-3" attributes={{ style: { color: '#fff' } }}>LIVE</Text>
                </View>
              )}
            </View>

            {/* Info */}
            <View
              direction="column"
              justify="center"
              gap={3}
              padding={6}
              attributes={{ style: { flex: 1 } }}
            >
              <View direction="row" align="center" gap={2}>
                <View
                  attributes={{
                    style: {
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      animation: 'pulse 2s infinite',
                    },
                  }}
                />
                <Text
                  variant="caption-1"
                  weight="bold"
                  attributes={{
                    style: {
                      color: '#22c55e',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    },
                  }}
                >
                  Live Now
                </Text>
              </View>

              <Text
                variant="featured-3"
                weight="medium"
              >
                {stream.title}
              </Text>

              {stream.description && (
                <Text variant="body-2" color="neutral-faded">
                  {stream.description}
                </Text>
              )}

              <Text
                variant="body-2"
                attributes={{
                  style: {
                    color: '#22c55e',
                    fontWeight: 500,
                  },
                }}
              >
                Watch now →
              </Text>
            </View>
          </View>
        </Card>
      </Link>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </View>
  );
}
