'use client';

import { useState } from 'react';
import { View, Button, Text, TextField, NumberField, Switch } from 'reshaped';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { CategoryInput } from '@/components/admin/CategoryInput';

export default function NewProductPage() {
  const router = useRouter();
  const { getAccessToken } = usePrivy();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    photoUrl: '',
    videoUrl: '',
    price: 0,
    category: '',
    tags: '',
    inventory: 0,
    isFeatured: false,
  });
  
  const setDescription = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
  };
  
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);
      const token = await getAccessToken();
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('contentType', 'product');

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
      setFormData(prev => ({ ...prev, photoUrl: data.url }));
    } catch (error) {
      console.error('Upload error:', error);
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      setCreating(true);
      setError(null);
      
      // Parse tags into array
      const tagsArray = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      
      // Prepare mutation
      const mutation = `
        mutation CreateProduct($input: CreateProductInput!) {
          createProduct(input: $input) {
            id
            name
            slug
            stripeProductId
            stripePriceId
          }
        }
      `;
      
      // Prepare variables
      const variables = {
        input: {
          name: formData.name,
          description: formData.description,
          photoUrl: formData.photoUrl,
          videoUrl: formData.videoUrl || null,
          price: parseFloat(formData.price.toString()),
          category: formData.category,
          tags: tagsArray,
          inventory: parseInt(formData.inventory.toString(), 10),
        },
      };
      
      // Get token for authorization
      const token = await getAccessToken();
      
      // Execute GraphQL mutation
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      });
      
      const result = await response.json();
      
      if (result.errors) {
        throw new Error(result.errors[0].message || 'Failed to create product');
      }

      // If featured is checked, set this product as featured
      if (formData.isFeatured && result.data?.createProduct?.id) {
        const featuredResponse = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              mutation SetFeaturedProduct($id: ID!) {
                setFeaturedProduct(id: $id) {
                  id
                  isFeatured
                }
              }
            `,
            variables: {
              id: result.data.createProduct.id,
            },
          }),
        });
        
        const featuredResult = await featuredResponse.json();
        if (featuredResult.errors) {
          console.error('Failed to set featured:', featuredResult.errors);
          // Don't fail the whole operation, just log the error
        }
      }
      
      // Navigate back to products list
      router.push('/admin/products');
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error instanceof Error ? error.message : 'Failed to create product');
      setCreating(false);
    }
  };

  return (
    <View padding={4} gap={4}>
      <Text variant="featured-3">Create New Product</Text>
      
      {error && (
        <View padding={2} backgroundColor="critical-faded" borderRadius="medium">
          <Text color="critical">{error}</Text>
        </View>
      )}
      
      <View gap={2}>
        <Text>Name *</Text>
        <TextField
          name="name"
          value={formData.name}
          onChange={({ value }) => setFormData(prev => ({ ...prev, name: value }))}
          placeholder="Product name"
        />
      </View>
      
      <View gap={2}>
        <Text>Category *</Text>
        <CategoryInput
          value={formData.category}
          onChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          placeholder="Select or create a category..."
          disabled={creating}
          entityType="product"
        />
      </View>

      <View gap={2}>
        <Text>Description *</Text>
        <RichTextEditor
          value={formData.description}
          onChange={setDescription}
          placeholder="Product description"
        />
      </View>
      
      <View gap={2}>
        <Text>Price (USD) *</Text>
        <NumberField
          name="price"
          value={formData.price}
          onChange={({ value }) => setFormData(prev => ({ ...prev, price: value }))}
          placeholder="0.00"
          min={0}
          step={0.01}
          increaseAriaLabel="Increase price"
          decreaseAriaLabel="Decrease price"
        />
      </View>
      
      <View gap={2}>
        <Text>Inventory *</Text>
        <NumberField
          name="inventory"
          value={formData.inventory}
          onChange={({ value }) => setFormData(prev => ({ ...prev, inventory: value }))}
          placeholder="0"
          min={0}
          step={1}
          increaseAriaLabel="Increase inventory"
          decreaseAriaLabel="Decrease inventory"
        />
      </View>
      
      <View gap={2}>
        <Text>Tags (comma separated)</Text>
        <TextField
          name="tags"
          value={formData.tags}
          onChange={({ value }) => setFormData(prev => ({ ...prev, tags: value }))}
          placeholder="organic, vegan, gluten-free"
        />
      </View>

      <View gap={2}>
        <Text>Product Image *</Text>
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
        {formData.photoUrl && (
          <img 
            src={formData.photoUrl}
            alt="Product preview" 
            style={{ maxWidth: '300px', height: 'auto' }} 
          />
        )}
      </View>
      
      <View gap={2}>
        <Text>Product Video URL (optional)</Text>
        <TextField
          name="videoUrl"
          value={formData.videoUrl}
          onChange={({ value }) => setFormData(prev => ({ ...prev, videoUrl: value }))}
          placeholder="https://example.com/video.mp4"
        />
      </View>
      
      <View gap={2}>
        <Switch 
          name="isFeatured"
          checked={formData.isFeatured} 
          onChange={({ checked }) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
        >
          {formData.isFeatured ? 'Featured' : 'Not Featured'}
        </Switch>
      </View>

      <Button 
        variant="solid"
        disabled={
          uploading || 
          creating || 
          !formData.name || 
          !formData.description || 
          !formData.photoUrl ||
          !formData.category ||
          formData.price <= 0
        }
        onClick={handleCreateProduct}
        loading={creating}
      >
        {creating ? 'Creating...' : 'Create Product'}
      </Button>
    </View>
  );
} 