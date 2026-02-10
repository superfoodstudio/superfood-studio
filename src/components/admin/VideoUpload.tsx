'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, Button } from 'reshaped';
import { usePrivy } from '@privy-io/react-auth';
import { ipfsUrl } from '@/lib/ipfs';

interface VideoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function VideoUpload({ value, onChange, disabled }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getAccessToken } = usePrivy();

  // The displayed preview: use localPreview (blob URL during upload) or fall back to value
  const displayUrl = localPreview || value || null;

  // Detect media type
  const isAudio = displayUrl && (fileType?.startsWith('audio/') || displayUrl.includes('.wav') || displayUrl.includes('audio/') || displayUrl.toLowerCase().includes('wav'));
  const isVideo = displayUrl && !isAudio;

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'audio/wav', 'audio/wave'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload only MP4 videos or WAV audio files');
      return;
    }

    // Create local preview immediately
    const blobUrl = URL.createObjectURL(file);
    setLocalPreview(blobUrl);
    setFileType(file.type);

    try {
      setUploading(true);
      const token = await getAccessToken();

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();

      // Clean up blob URL and notify parent
      URL.revokeObjectURL(blobUrl);
      setLocalPreview(null);

      const cid = data.cid || data.url;
      onChange(cid);

    } catch (error) {
      // Revert on error
      URL.revokeObjectURL(blobUrl);
      setLocalPreview(null);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [disabled]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const hasExistingVideo = !!value;

  return (
    <View direction="column" gap={4}>
      {/* Preview of existing/uploading video */}
      {displayUrl && (
        <View direction="column" gap={2}>
          <View direction="row" justify="space-between" align="center">
            <Text variant="body-2" color="neutral">Current video</Text>
            {hasExistingVideo && !localPreview && (
              <Button
                variant="ghost"
                size="small"
                onClick={() => onChange('')}
                disabled={disabled || uploading}
              >
                Remove
              </Button>
            )}
          </View>
          <View
            attributes={{
              style: {
                maxWidth: '500px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#000'
              }
            }}
          >
            {isVideo ? (
              <video
                src={displayUrl.startsWith('blob:') ? displayUrl : ipfsUrl(displayUrl)}
                controls
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '300px',
                  borderRadius: '8px'
                }}
              >
                Your browser does not support video playback.
              </video>
            ) : isAudio ? (
              <View padding={4} backgroundColor="neutral-faded">
                <audio
                  src={displayUrl.startsWith('blob:') ? displayUrl : ipfsUrl(displayUrl)}
                  controls
                  style={{ width: '100%' }}
                >
                  Your browser does not support audio playback.
                </audio>
              </View>
            ) : null}
          </View>
        </View>
      )}

      {/* Upload Area */}
      <View
        attributes={{
          style: {
            border: isDragging ? '2px dashed #999' : '2px dashed #e2e8f0',
            borderRadius: '8px',
            padding: hasExistingVideo ? '20px' : '32px',
            textAlign: 'center',
            backgroundColor: isDragging ? '#f5f5f5' : '#fafafa',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease'
          },
          onDragOver: handleDragOver,
          onDragLeave: handleDragLeave,
          onDrop: handleDrop,
          onClick: disabled ? undefined : handleBrowseClick
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,audio/wav"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
          disabled={disabled || uploading}
        />

        <View direction="column" gap={2} align="center">
          {!hasExistingVideo && (
            <View
              attributes={{
                style: {
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#e9ecef',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </View>
          )}

          <Text variant="body-2">
            {uploading ? 'Uploading...' : hasExistingVideo ? 'Drop a new video to replace or click to browse' : 'Drop your video here or click to browse'}
          </Text>

          {!hasExistingVideo && (
            <Text variant="body-2" color="neutral-faded">
              Supports MP4 videos and WAV audio files
            </Text>
          )}

          {!uploading && (
            <Button
              variant="outline"
              size="small"
              disabled={disabled}
            >
              {hasExistingVideo ? 'Replace' : 'Browse Files'}
            </Button>
          )}
        </View>
      </View>

      {/* Cancel local preview */}
      {localPreview && (
        <Button
          variant="ghost"
          size="small"
          onClick={() => {
            URL.revokeObjectURL(localPreview);
            setLocalPreview(null);
          }}
          disabled={uploading}
        >
          Cancel
        </Button>
      )}

      {uploading && (
        <View
          attributes={{
            style: {
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '20px',
              borderRadius: '8px',
              zIndex: 1000
            }
          }}
        >
          <Text attributes={{ style: { color: 'white' } }}>Uploading video... Please wait.</Text>
        </View>
      )}
    </View>
  );
}
