'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, Button } from 'reshaped';
import { usePrivy } from '@privy-io/react-auth';

interface VideoUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function VideoUpload({ value, onChange, disabled }: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getAccessToken } = usePrivy();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update preview when value changes
  useEffect(() => {
    if (value && value !== preview) {
      setPreview(value);
    }
  }, [value]);

  // Initialize fileType for existing values  
  useEffect(() => {
    if (value && !fileType) {
      // Try to detect file type from URL patterns
      if (value.includes('video') || value.includes('.mp4') || value.toLowerCase().includes('mp4')) {
        setFileType('video/mp4');
      } else if (value.includes('audio') || value.includes('.wav') || value.toLowerCase().includes('wav')) {
        setFileType('audio/wav');
      } else {
        // For video-centric recipes, default to video if we can't detect
        setFileType('video/mp4');
      }
    }
  }, [value, fileType]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'audio/wav', 'audio/wave'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload only MP4 videos or WAV audio files');
      return;
    }

    // Create local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

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
      
      // Store file type for media detection
      setFileType(file.type);
      
      // Clean up local preview and use uploaded URL
      URL.revokeObjectURL(localPreview);
      
      // Handle different URL formats from the API
      let uploadedUrl;
      if (data.url.startsWith('https://ipfs.io/ipfs/')) {
        // Already a full IPFS gateway URL
        uploadedUrl = data.url;
      } else if (data.url.startsWith('ipfs://')) {
        // IPFS protocol URL, convert to gateway URL
        uploadedUrl = `https://ipfs.io/ipfs/${data.url.replace('ipfs://', '')}`;
      } else {
        // Assume it's just the hash
        uploadedUrl = `https://ipfs.io/ipfs/${data.url}`;
      }
      
      setPreview(uploadedUrl);
      onChange(uploadedUrl);
      
    } catch (error) {
      console.error('Upload error:', error);
      // Revert to original preview on error
      URL.revokeObjectURL(localPreview);
      setPreview(value || null);
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

  // Use stored file type or fallback to URL-based detection
  const isVideo = preview && (fileType?.startsWith('video/') || preview.includes('.mp4') || preview.includes('video/') || preview.toLowerCase().includes('mp4'));
  const isAudio = preview && (fileType?.startsWith('audio/') || preview.includes('.wav') || preview.includes('audio/') || preview.toLowerCase().includes('wav'));

  return (
    <View direction="column" gap={4}>
      {/* Upload Area */}
      <View
        attributes={{
          style: {
            border: isDragging ? '2px dashed #6b4c7a' : '2px dashed #e2e8f0',
            borderRadius: '8px',
            padding: '32px',
            textAlign: 'center',
            backgroundColor: isDragging ? '#f8f5ff' : '#fafafa',
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
        
        <View direction="column" gap={3} align="center">
          <View
            attributes={{
              style: {
                width: '48px',
                height: '48px',
                backgroundColor: '#6b4c7a',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '20px'
              }
            }}
          >
            🎬
          </View>
          
          <Text variant="title-4">
            {uploading ? 'Uploading...' : 'Drop your video here or click to browse'}
          </Text>
          
          <Text variant="body-2" color="neutral-faded">
            Supports MP4 videos and WAV audio files
          </Text>
          
          {!uploading && (
            <Button 
              variant="outline" 
              size="small"
              disabled={disabled}
            >
              Browse Files
            </Button>
          )}
        </View>
      </View>

      {/* Preview */}
      {preview && (
        <View direction="column" gap={2}>
          <Text variant="body-2" color="neutral">Preview:</Text>
          <View
            attributes={{
              style: {
                maxWidth: '400px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#000'
              }
            }}
          >
{isVideo ? (
              <video
                src={preview}
                controls
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '300px',
                  borderRadius: '8px'
                }}
              >
                <Text>Your browser does not support video playback.</Text>
              </video>
            ) : isAudio ? (
              <View padding={4} backgroundColor="neutral-faded">
                <audio
                  src={preview}
                  controls
                  style={{ width: '100%' }}
                >
                  <Text>Your browser does not support audio playback.</Text>
                </audio>
                <Text variant="body-2" align="center" color="neutral-faded">
                  Audio File: {preview.split('/').pop()}
                </Text>
              </View>
            ) : (
              <Text variant="body-2" color="neutral-faded">
                Preview not available
              </Text>
            )}
          </View>
          
          {preview !== value && (
            <Button
              variant="ghost"
              size="small"
              onClick={() => {
                if (preview && preview.startsWith('blob:')) {
                  URL.revokeObjectURL(preview);
                }
                setPreview(value || null);
              }}
              disabled={uploading}
            >
              Cancel Upload
            </Button>
          )}
        </View>
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