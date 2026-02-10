'use client';

import { useState, useRef } from 'react';
import { View, Text, Button } from 'reshaped';
import { ipfsUrl } from '@/lib/ipfs';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
  label?: string;
}

export function ImageUpload({ value, onChange, disabled = false, label = "Upload Image" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      
      // Store the CID (the upload API returns { cid })
      const cid = result.cid || result.url;
      if (!cid) {
        throw new Error('No CID returned from upload');
      }
      setPreview(cid);
      onChange(cid);
    } catch (error) {
      alert('Failed to upload image. Please try again.');
      // Revert preview on error
      setPreview(value || null);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled || uploading) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemove = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <View direction="column" gap={3}>
      {preview ? (
        <View direction="column" gap={2}>
          <View
            attributes={{
              style: {
                position: 'relative',
                width: '200px',
                height: '150px',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#f5f5f5'
              }
            }}
          >
            <img
              src={preview.startsWith('blob:') ? preview : ipfsUrl(preview)}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </View>
          
          <View direction="row" gap={2}>
            <Button
              variant="ghost"
              size="small"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || uploading}
            >
              {uploading ? 'Uploading...' : 'Replace'}
            </Button>
            <Button
              variant="ghost"
              size="small"
              color="critical"
              onClick={handleRemove}
              disabled={disabled || uploading}
            >
              Remove
            </Button>
          </View>
        </View>
      ) : (
        <View
          padding={6}
          attributes={{
            style: {
              border: `2px dashed ${dragOver ? '#999' : '#ccc'}`,
              borderRadius: '8px',
              backgroundColor: dragOver ? '#f5f5f5' : '#fafafa',
              cursor: disabled || uploading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            },
            onDrop: handleDrop,
            onDragOver: handleDragOver,
            onDragLeave: handleDragLeave,
            onClick: () => !disabled && !uploading && fileInputRef.current?.click()
          }}
        >
          <View direction="column" align="center" gap={3}>
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
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </View>
            
            <View direction="column" align="center" gap={1}>
              <Text variant="body-1">
                {uploading ? 'Uploading...' : dragOver ? 'Drop image here' : 'Drop image here or click to browse'}
              </Text>
              <Text variant="body-2" color="neutral-faded">
                Supports JPG, PNG, WebP (Max 10MB)
              </Text>
            </View>
            
            {!uploading && (
              <Button variant="outline" size="small">
                {label}
              </Button>
            )}
          </View>
        </View>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled || uploading}
      />
    </View>
  );
}