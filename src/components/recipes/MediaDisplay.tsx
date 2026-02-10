'use client';

import { View, Text } from 'reshaped';
import { ipfsUrl } from '@/lib/ipfs';

interface MediaDisplayProps {
  mediaUrl: string;
  altText: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MediaDisplay({ mediaUrl, altText, className, style }: MediaDisplayProps) {
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
            borderRadius: '8px'
          },
          className
        }}
      >
        <Text color="neutral-faded">No media available</Text>
      </View>
    );
  }

  // Detect media type from URL
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
          <View
            attributes={{
              style: {
                width: '48px',
                height: '48px',
                backgroundColor: '#e9ecef',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </View>
          <View direction="column">
            <Text variant="title-4">{altText}</Text>
            <Text variant="body-2" color="neutral-faded">
              Audio Recipe
            </Text>
          </View>
        </View>
        
        <audio
          src={ipfsUrl(mediaUrl)}
          controls
          style={{ width: '100%' }}
        >
          <Text>Your browser does not support audio playback.</Text>
        </audio>
      </View>
    );
  }

  if (isVideo) {
    // Video content - match homepage style
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
          src={ipfsUrl(mediaUrl)}
          controls
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '24px'
          }}
        >
          <Text>Your browser does not support video playback.</Text>
        </video>
      </View>
    );
  }

  // Fallback to image for backward compatibility
  return (
    <View
      attributes={{
        style: {
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          ...style
        },
        className
      }}
    >
      <img
        src={ipfsUrl(mediaUrl)}
        alt={altText}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        onError={(e) => {
          // If image fails to load, show placeholder
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = `
            <div style="background: #f5f5f5; display: flex; align-items: center; justify-content: center; height: 100%; border-radius: 8px;">
              <span style="color: #666; font-size: 14px;">Media not available</span>
            </div>
          `;
        }}
      />
    </View>
  );
}