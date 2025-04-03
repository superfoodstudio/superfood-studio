'use client';

import { useState } from 'react';
import { View, Button, Text, TextArea } from 'reshaped';
import { usePrivy } from '@privy-io/react-auth';

export default function NewRecipePage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
  });
  const [uploading, setUploading] = useState(false);
  const { getAccessToken } = usePrivy();

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
      setFormData(prev => ({ ...prev, imageUrl: data.pinataUrl }));
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  return (
    <View padding={4} gap={4}>
      <Text variant="featured-3">Create New Recipe</Text>
      
      <View gap={2}>
        <Text>Title</Text>
        <TextArea
          name="title"
          value={formData.title}
          onChange={({ value }) => setFormData(prev => ({ ...prev, title: value }))}
          placeholder="Recipe title"
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
        <Text>Image</Text>
        <input
          type="file"
          accept="image/*"
          disabled={uploading}
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
        {formData.imageUrl && (
          <img 
            src={formData.imageUrl} 
            alt="Recipe preview" 
            style={{ maxWidth: '300px', height: 'auto' }} 
          />
        )}
      </View>

      <Button 
        variant="solid"
        disabled={uploading || !formData.title || !formData.description || !formData.imageUrl}
        onClick={async () => {
          // TODO: Create recipe
          console.log('Creating recipe:', formData);
        }}
      >
        Create Recipe
      </Button>
    </View>
  );
} 