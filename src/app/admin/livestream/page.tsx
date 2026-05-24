'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { View, Text, Button, Card, TextField } from 'reshaped';

interface Stream {
  id: string;
  title: string;
  description: string | null;
  streamKey: string;
  playbackId: string;
  status: 'IDLE' | 'LIVE' | 'ENDED';
  startedAt: string | null;
  endedAt: string | null;
  rtmpUrl?: string;
  playbackUrl?: string;
}

export default function AdminLivestreamPage() {
  const { getAccessToken } = usePrivy();
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedStream, setExpandedStream] = useState<Stream | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchStreams = useCallback(async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/admin/livestream', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStreams(data.streams);
      }
    } catch {}
    finally { setLoading(false); }
  }, [getAccessToken]);

  useEffect(() => { fetchStreams(); }, [fetchStreams]);

  async function handleCreate() {
    if (!newTitle.trim()) return;
    setCreating(true);
    try {
      const token = await getAccessToken();
      const res = await fetch('/api/admin/livestream', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });
      if (res.ok) {
        setNewTitle('');
        setNewDescription('');
        setShowCreate(false);
        await fetchStreams();
      }
    } catch {}
    finally { setCreating(false); }
  }

  async function handleDelete(id: string) {
    try {
      const token = await getAccessToken();
      await fetch(`/api/admin/livestream/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchStreams();
    } catch {}
  }

  async function handleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedStream(null);
      return;
    }
    try {
      const token = await getAccessToken();
      const res = await fetch(`/api/admin/livestream/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setExpandedStream(data.stream);
        setExpandedId(id);
      }
    } catch {}
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  const statusColor = (status: string) => {
    if (status === 'LIVE') return '#22c55e';
    if (status === 'IDLE') return '#eab308';
    return '#9ca3af';
  };

  return (
    <View direction="column" gap={8} padding={10} attributes={{ style: { maxWidth: '900px', margin: '0 auto', minHeight: '100vh' } }}>
      <View direction="row" align="center" justify="space-between">
        <Text variant="featured-2" weight="bold" attributes={{ style: { color: '#8a8a8a', fontSize: '14px', fontWeight: '600', letterSpacing: '1.2px' } }}>
          LIVESTREAM
        </Text>
        <Button variant="outline" size="medium" onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? 'Cancel' : 'New Stream'}
        </Button>
      </View>

      {showCreate && (
        <Card padding={6} attributes={{ style: { border: '1px solid #e0ddd8', borderRadius: '2px' } }}>
          <View direction="column" gap={4}>
            <TextField
              name="title"
              placeholder="Stream title"
              value={newTitle}
              onChange={({ value }) => setNewTitle(value)}
            />
            <TextField
              name="description"
              placeholder="Description (optional)"
              value={newDescription}
              onChange={({ value }) => setNewDescription(value)}
            />
            <Button variant="solid" size="medium" onClick={handleCreate} disabled={creating || !newTitle.trim()}>
              {creating ? 'Creating...' : 'Create Stream'}
            </Button>
          </View>
        </Card>
      )}

      {loading ? (
        <Text attributes={{ style: { color: '#9ca3af', fontSize: '14px' } }}>Loading...</Text>
      ) : streams.length === 0 ? (
        <Text attributes={{ style: { color: '#9ca3af', fontSize: '14px' } }}>No streams yet. Create one to get started.</Text>
      ) : (
        <View direction="column" gap={4}>
          {streams.map((stream) => (
            <Card key={stream.id} padding={5} attributes={{ style: { border: '1px solid #e0ddd8', borderRadius: '2px' } }}>
              <View direction="column" gap={3}>
                <View direction="row" align="center" justify="space-between">
                  <View direction="row" align="center" gap={3}>
                    <View attributes={{ style: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusColor(stream.status) } }} />
                    <Text weight="medium" attributes={{ style: { fontSize: '14px' } }}>{stream.title}</Text>
                    <Text attributes={{ style: { fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' } }}>
                      {stream.status}
                    </Text>
                  </View>
                  <View direction="row" gap={2}>
                    <Button variant="ghost" size="small" onClick={() => handleExpand(stream.id)}>
                      {expandedId === stream.id ? 'Hide' : 'Details'}
                    </Button>
                    {stream.status !== 'LIVE' && (
                      <Button variant="ghost" size="small" onClick={() => handleDelete(stream.id)} attributes={{ style: { color: '#ef4444' } }}>
                        End
                      </Button>
                    )}
                  </View>
                </View>

                {expandedId === stream.id && expandedStream && (
                  <View direction="column" gap={3} attributes={{ style: { borderTop: '1px solid #e0ddd8', paddingTop: '12px', marginTop: '4px' } }}>
                    <View direction="column" gap={1}>
                      <Text attributes={{ style: { fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' } }}>
                        RTMP Ingest URL
                      </Text>
                      <View direction="row" align="center" gap={2}>
                        <Text attributes={{ style: { fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all' } }}>
                          {expandedStream.rtmpUrl}
                        </Text>
                        <Button variant="ghost" size="small" onClick={() => copyToClipboard(expandedStream.rtmpUrl!, 'rtmp')}>
                          {copied === 'rtmp' ? 'Copied!' : 'Copy'}
                        </Button>
                      </View>
                    </View>

                    <View direction="column" gap={1}>
                      <Text attributes={{ style: { fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' } }}>
                        Stream Key
                      </Text>
                      <View direction="row" align="center" gap={2}>
                        <Text attributes={{ style: { fontSize: '13px', fontFamily: 'monospace' } }}>
                          {expandedStream.streamKey}
                        </Text>
                        <Button variant="ghost" size="small" onClick={() => copyToClipboard(expandedStream.streamKey, 'key')}>
                          {copied === 'key' ? 'Copied!' : 'Copy'}
                        </Button>
                      </View>
                    </View>

                    <View direction="column" gap={1}>
                      <Text attributes={{ style: { fontSize: '11px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' } }}>
                        Playback URL (HLS)
                      </Text>
                      <View direction="row" align="center" gap={2}>
                        <Text attributes={{ style: { fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all' } }}>
                          {expandedStream.playbackUrl}
                        </Text>
                        <Button variant="ghost" size="small" onClick={() => copyToClipboard(expandedStream.playbackUrl!, 'playback')}>
                          {copied === 'playback' ? 'Copied!' : 'Copy'}
                        </Button>
                      </View>
                    </View>

                    <View direction="column" gap={1} attributes={{ style: { backgroundColor: '#f5f3f0', padding: '12px', borderRadius: '2px' } }}>
                      <Text weight="medium" attributes={{ style: { fontSize: '12px' } }}>OBS Setup</Text>
                      <Text attributes={{ style: { fontSize: '12px', color: '#6b7280' } }}>
                        1. Open OBS &rarr; Settings &rarr; Stream{'\n'}
                        2. Service: Custom{'\n'}
                        3. Server: Copy the RTMP URL above{'\n'}
                        4. Stream Key: Copy the stream key above{'\n'}
                        5. Click &quot;Start Streaming&quot;
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </Card>
          ))}
        </View>
      )}
    </View>
  );
}
