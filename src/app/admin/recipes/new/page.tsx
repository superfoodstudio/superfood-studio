'use client';

import { useState } from 'react';
import { View, Text, Button, Select, TextArea } from 'reshaped';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { uploadToPinata } from '@/lib/services/pinata';

export default function NewRecipe() {
  const router = useRouter();
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    ingredients: '',
    mediaUrl: '',
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    try {
      setLoading(true);
      const mediaUrl = await uploadToPinata(e.target.files[0]);
      setFormData(prev => ({ ...prev, mediaUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          isPublished: isLive,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create recipe');
      }

      router.push('/admin/recipes');
    } catch (error) {
      console.error('Error creating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View direction="column" gap={6} padding={8} backgroundColor="page">
      <View direction="row" justify="space-between" align="center">
        <Text variant="title-2">ADD ITEM</Text>
        <View 
          direction="row" 
          align="center" 
          gap={2} 
          backgroundColor="elevation-base"
          padding={2}
          attributes={{
            style: { borderRadius: '20px' }
          }}
        >
          <Text variant="body-2">Item is {isLive ? 'Live' : 'Not Live'}</Text>
          <Button 
            variant="ghost" 
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? '👁' : '👁‍🗨'}
          </Button>
        </View>
      </View>

      <View direction="row" gap={8}>
        {/* Left Column - Image Upload */}
        <View direction="column" gap={4} flex={1}>
          <View 
            height={400} 
            backgroundColor="elevation-base" 
            align="center" 
            justify="center"
            attributes={{
              style: { position: 'relative' }
            }}
          >
            {formData.mediaUrl ? (
              <Image
                src={formData.mediaUrl}
                alt="Recipe preview"
                fill
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <Text variant="body-2" color="neutral-faded">No image uploaded</Text>
            )}
          </View>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
            id="image-upload"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('image-upload')?.click()}
            disabled={loading}
          >
            ADD MORE
          </Button>
        </View>

        {/* Right Column - Form Fields */}
        <View direction="column" gap={4} flex={1}>
          <input
            type="text"
            placeholder="item name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />

          <Select
            name="category"
            placeholder="category"
            value={formData.category}
            onChange={(value) => setFormData(prev => ({ ...prev, category: String(value.value) }))}
            options={[
              { value: 'food', label: 'Food' },
              { value: 'beauty', label: 'Beauty' },
              { value: 'wellness', label: 'Wellness' },
            ]}
          />

          <TextArea
            name="description"
            placeholder="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.value }))}
            attributes={{
              rows: 6
            }}
          />

          <TextArea
            name="ingredients"
            placeholder="ingredients"
            value={formData.ingredients}
            onChange={(e) => setFormData(prev => ({ ...prev, ingredients: e.value }))}
            attributes={{
              rows: 6
            }}
          />

          <View direction="row" gap={2}>
            <Button
              variant="solid"
              onClick={handleSubmit}
              disabled={loading}
              attributes={{
                style: { flex: 1, backgroundColor: '#2E1A47' }
              }}
            >
              SAVE
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
              attributes={{
                style: { flex: 1 }
              }}
            >
              BACK
            </Button>
          </View>
        </View>
      </View>
    </View>
  );
} 