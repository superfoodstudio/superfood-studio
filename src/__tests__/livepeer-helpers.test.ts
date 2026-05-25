import { describe, it, expect } from 'vitest';
import { getRtmpIngestUrl, getPlaybackUrl } from '@/lib/livepeer';

describe('getRtmpIngestUrl', () => {
  it('returns the LivePeer RTMP ingest server URL', () => {
    expect(getRtmpIngestUrl()).toBe('rtmp://rtmp.livepeer.com/live');
  });
});

describe('getPlaybackUrl', () => {
  it('generates correct HLS URL from playback ID', () => {
    expect(getPlaybackUrl('play123')).toBe(
      'https://livepeercdn.studio/hls/play123/index.m3u8'
    );
  });

  it('handles playback ID with special characters', () => {
    expect(getPlaybackUrl('play-123_abc')).toBe(
      'https://livepeercdn.studio/hls/play-123_abc/index.m3u8'
    );
  });
});
