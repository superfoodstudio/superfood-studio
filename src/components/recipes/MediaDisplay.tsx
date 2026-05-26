'use client';

import { View, Text } from 'reshaped';
import Image from 'next/image';
import { ipfsUrl } from '@/lib/ipfs';

interface MediaDisplayProps {
  mediaUrl: string;
  previewImageUrl?: string | null;
  altText: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MediaDisplay({ mediaUrl, previewImageUrl, altText, className, style }: MediaDisplayProps) {
  if (!mediaUrl) {
    return (
      <View
        attributes={{
          style: {
            ...style,
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
            minHeight: '200px',
          },
          className
        }}
      >
        <Text color="neutral-faded">No media available</Text>
      </View>
    );
  }

  const isAudio = mediaUrl.includes('.wav') || mediaUrl.includes('audio/') || mediaUrl.toLowerCase().includes('wav');
  const isVideo = mediaUrl.includes('.mp4') || mediaUrl.includes('video/') || mediaUrl.toLowerCase().includes('mp4') || (!isAudio && !mediaUrl.includes('.jpg') && !mediaUrl.includes('.png') && !mediaUrl.includes('.jpeg') && !mediaUrl.includes('.gif'));

  if (isAudio) {
    return (
      <View
        direction="column"
        gap={4}
        padding={6}
        attributes={{
          style: {
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            ...style
          },
          className
        }}
      >
        <View direction="row" align="center" gap={3}>
          <View direction="column">
            <Text variant="title-4">{altText}</Text>
            <Text variant="body-2" color="neutral-faded">Audio Recipe</Text>
          </View>
        </View>
        <audio src={ipfsUrl(mediaUrl)} controls style={{ width: '100%' }}>
          <Text>Your browser does not support audio playback.</Text>
        </audio>
      </View>
    );
  }

  if (isVideo) {
    // Stream through our proxy to avoid CORB on direct Pinata gateway
    const cid = mediaUrl.replace(/.*\/ipfs\//, '').replace(/\?.*/, '');
    const videoSrc = `/api/ipfs/${cid}`;
    const posterSrc = previewImageUrl ? ipfsUrl(previewImageUrl) : undefined;

    return (
      <View
        attributes={{
          style: {
            position: 'relative',
            width: '100%',
            borderRadius: '24px',
            overflow: 'hidden',
            backgroundColor: '#000',
            ...style
          },
          className
        }}
      >
        <video
          src={videoSrc}
          poster={posterSrc}
          controls
          preload="metadata"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '600px',
            borderRadius: '24px',
          }}
        >
          <Text>Your browser does not support video playback.</Text>
        </video>
      </View>
    );
  }

  // Image fallback
  return (
    <View
      attributes={{
        style: {
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          minHeight: '300px',
          ...style
        },
        className
      }}
    >
      <Image
        src={ipfsUrl(mediaUrl)}
        alt={altText}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        style={{ objectFit: 'cover' }}
      />
    </View>
  );
}
