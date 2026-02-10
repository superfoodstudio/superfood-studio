'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { View, TextField, NumberField, Switch } from 'reshaped';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FormField } from '@/components/admin/FormField';
import { FormError } from '@/components/admin/FormError';
import { AdminFormActions } from '@/components/admin/AdminFormActions';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { CategoryInput } from '@/components/admin/CategoryInput';

export default function NewProductPage() {
  const router = useRouter();
  const { getAccessToken } = usePrivy();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const token = await getAccessToken();

      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation CreateProduct($input: CreateProductInput!) {
              createProduct(input: $input) {
                id
                name
                slug
                stripeProductId
                stripePriceId
              }
            }
          `,
          variables: {
            input: {
              name,
              description,
              photoUrl,
              videoUrl: videoUrl || null,
              price: parseFloat(price.toString()),
              category,
              tags: tagsArray,
              inventory: parseInt(inventory.toString(), 10),
            },
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message || 'Failed to create product');
      }

      if (isFeatured && result.data?.createProduct?.id) {
        await fetch('/api/graphql', {
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
            variables: { id: result.data.createProduct.id },
          }),
        });
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Create New Product"
      backUrl="/admin/products"
    >
      <View direction="column" gap={6} width="100%">
        <FormError error={error} />

        <View gap={4} maxWidth="800px" width="100%">
          <FormField label="Product Name" required>
            <TextField
              name="name"
              value={name}
              onChange={({ value }) => setName(value)}
              placeholder="Product name"
            />
          </FormField>

          <FormField label="Category" required>
            <CategoryInput
              value={category}
              onChange={setCategory}
              placeholder="Select or create a category..."
              disabled={saving}
              entityType="product"
            />
          </FormField>

          <FormField label="Description" required>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Product description"
            />
          </FormField>

          <FormField label="Price (USD)" required>
            <NumberField
              name="price"
              value={price}
              onChange={({ value }) => setPrice(value)}
              placeholder="0.00"
              min={0}
              step={0.01}
              increaseAriaLabel="Increase price"
              decreaseAriaLabel="Decrease price"
            />
          </FormField>

          <FormField label="Inventory" required>
            <NumberField
              name="inventory"
              value={inventory}
              onChange={({ value }) => setInventory(value)}
              placeholder="0"
              min={0}
              step={1}
              increaseAriaLabel="Increase inventory"
              decreaseAriaLabel="Decrease inventory"
            />
          </FormField>

          <FormField label="Tags (comma separated)">
            <TextField
              name="tags"
              value={tags}
              onChange={({ value }) => setTags(value)}
              placeholder="organic, vegan, gluten-free"
            />
          </FormField>

          <FormField label="Product Image" required>
            <ImageUpload
              value={photoUrl}
              onChange={setPhotoUrl}
              disabled={saving}
              label="Upload Product Image"
            />
          </FormField>

          <FormField label="Featured">
            <Switch
              name="isFeatured"
              checked={isFeatured}
              onChange={({ checked }) => setIsFeatured(checked)}
            >
              {isFeatured ? 'Featured' : 'Not Featured'}
            </Switch>
          </FormField>

          <AdminFormActions
            isNew={true}
            isSaving={saving}
            isDeleting={false}
            onSave={handleSubmit}
            onCancel={() => router.push('/admin/products')}
            disabled={!name || !description || !photoUrl || !category || price <= 0}
          />
        </View>
      </View>
    </AdminLayout>
  );
}
