import { describe, it, expect } from 'vitest';
import { getRtmpIngestUrl, getPlaybackUrl } from '@/lib/livepeer';

describe('getRtmpIngestUrl', () => {
  it('generates correct RTMP URL from stream key', () => {
    expect(getRtmpIngestUrl('abc123')).toBe('rtmp://rtmp.livepeer.studio/live/abc123');
  });

  it('handles stream key with special characters', () => {
    expect(getRtmpIngestUrl('key-with-dashes_and_underscores')).toBe(
      'rtmp://rtmp.livepeer.studio/live/key-with-dashes_and_underscores'
    );
  });

  it('handles empty stream key', () => {
    expect(getRtmpIngestUrl('')).toBe('rtmp://rtmp.livepeer.studio/live/');
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

  it('handles empty playback ID', () => {
    expect(getPlaybackUrl('')).toBe('https://livepeercdn.studio/hls//index.m3u8');
  });
});
