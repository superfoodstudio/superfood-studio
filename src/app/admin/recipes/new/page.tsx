'use client';

import { useState } from 'react';
import { View, Button, Text, TextArea } from 'reshaped';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';

export default function NewRecipePage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mediaUrl: '',
  });
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const { getAccessToken } = usePrivy();
  const router = useRouter();

  const handleFileUpload = async (file: File) => {
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
      console.log('Upload successful:', data);
      setFormData(prev => ({ ...prev, mediaUrl: data.url }));
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleCreateRecipe = async () => {
    try {
      setCreating(true);
      const token = await getAccessToken();
      
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Create recipe failed');
      }

      router.push('/admin/recipes');
    } catch (error) {
      console.error('Create recipe error:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <View padding={4} gap={4}>
      <Text variant="featured-3">Create New Recipe</Text>
      
      <View gap={2}>
        <Text>Name</Text>
        <TextArea
          name="name"
          value={formData.name}
          onChange={({ value }) => setFormData(prev => ({ ...prev, name: value }))}
          placeholder="Recipe name"
        />
      </View>

      <View gap={2}>
        <Text>Description</Text>
        <TextArea
          name="description"
          value={formData.description}
          onChange={({ value }) => setFormData(prev => ({ ...prev, description: value }))}
          placeholder="Recipe description"
        />
      </View>

      <View gap={2}>
        <Text>Media</Text>
        <input
          type="file"
          accept="image/*"
          disabled={uploading || creating}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              try {
                await handleFileUpload(file);
              } catch (error) {
                console.error('Failed to upload image:', error);
              }
            }
          }}
        />
        {formData.mediaUrl && (
          <img 
            src={`https://gateway.pinata.cloud/${formData.mediaUrl.replace('ipfs://', '')}`}
            alt="Recipe preview" 
            style={{ maxWidth: '300px', height: 'auto' }} 
          />
        )}
      </View>

      <Button 
        variant="solid"
        disabled={uploading || creating || !formData.name || !formData.description || !formData.mediaUrl}
        onClick={handleCreateRecipe}
        loading={creating}
      >
        {creating ? 'Creating...' : 'Create Recipe'}
      </Button>
    </View>
  );
} 