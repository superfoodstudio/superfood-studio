'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { View, TextField, NumberField, Switch } from 'reshaped';
import { useParams, useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FormField } from '@/components/admin/FormField';
import { FormError } from '@/components/admin/FormError';
import { AdminFormActions } from '@/components/admin/AdminFormActions';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { CategoryInput } from '@/components/admin/CategoryInput';
import { usePrivy } from '@privy-io/react-auth';
import { ipfsUrl } from '@/lib/ipfs';
import { FormSkeleton } from '@/components/ui/ListSkeleton';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { getAccessToken } = usePrivy();
  
  const isNew = params?.id === 'new';
  const productId = isNew ? null : params?.id as string;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState(0);
  const [tags, setTags] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Fetch product data if editing an existing product
  useEffect(() => {
    if (isNew) {
      setLoading(false);
      return;
    }

    async function fetchProduct() {
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query GetProduct($id: ID!) {
                product(id: $id) {
                  id
                  name
                  category
                  description
                  photoUrl
                  videoUrl
                  price
                  inventory
                  tags
                  isActive
                  isFeatured
                  stripeProductId
                  stripePriceId
                  createdAt
                }
              }
            `,
            variables: {
              id: productId,
            },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message || 'Error fetching product');
        }

        if (result.data && result.data.product) {
          const product = result.data.product;
          
          // Initialize form with product data
          setName(product.name);
          setCategory(product.category);
          setDescription(product.description || '');
          setPhotoUrl(product.photoUrl || '');
          setVideoUrl(product.videoUrl || '');
          setPrice(product.price);
          setInventory(product.inventory);
          setTags(product.tags ? product.tags.join(', ') : '');
          setIsActive(product.isActive);
          setIsFeatured(product.isFeatured || false);
        }
        
        setLoading(false);
      } catch (err) {
        // Error handled
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoading(false);
      }
    }

    fetchProduct();
  }, [isNew, productId]);

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
      setPhotoUrl(data.cid || data.url);
    } catch (error) {
      // Error handled
      setError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Parse tags
      const tagArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      
      // Prepare the mutation based on whether we're creating or updating
      const mutation = isNew
        ? `
            mutation CreateProduct($input: CreateProductInput!) {
              createProduct(input: $input) {
                id
                name
                stripeProductId
                stripePriceId
              }
            }
          `
        : `
            mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
              updateProduct(id: $id, input: $input) {
                id
                name
                stripeProductId
                stripePriceId
              }
            }
          `;

      // Prepare variables based on whether we're creating or updating
      const variables = isNew
        ? {
            input: {
              name,
              category,
              description,
              photoUrl,
              videoUrl: videoUrl || null,
              price: Number(price),
              inventory: Number(inventory),
              tags: tagArray,
            },
          }
        : {
            id: productId,
            input: {
              name,
              category,
              description,
              photoUrl,
              videoUrl: videoUrl || null,
              price: Number(price),
              inventory: Number(inventory),
              tags: tagArray,
              isActive,
            },
          };

      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: mutation,
          variables,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message || 'Error saving product');
      }

      // Handle featured toggle for editing existing products
      if (!isNew && isFeatured) {
        const featuredResponse = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
            variables: { id: productId },
          }),
        });
        
        const featuredResult = await featuredResponse.json();
        if (featuredResult.errors) {
          // Error handled
        }
      }

      // Navigate back to products list on success
      router.push('/admin/products');
    } catch (err) {
      // Error handled
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    // Confirm before deletion
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation DeleteProduct($id: ID!) {
              deleteProduct(id: $id) {
                success
              }
            }
          `,
          variables: {
            id: productId,
          },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message || 'Error deleting product');
        setDeleting(false);
      } else {
        // Navigate back to products list on success
        router.push('/admin/products');
      }
    } catch (err) {
      // Error handled
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Edit Product" backUrl="/admin/products">
        <FormSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title={isNew ? 'Create New Product' : 'Edit Product'} 
      backUrl="/admin/products"
    >
      <View 
        direction="column" 
        gap={6} 
        width="100%"
        attributes={{
          onSubmit: handleSubmit
        }}
      >
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
            <View direction="column" gap={2}>
              <input
                type="file"
                accept="image/*"
                disabled={uploading || saving}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      await handleFileUpload(file);
                    } catch (error) {
                      // Error handled
                    }
                  }
                }}
              />
              {photoUrl && (
                <img
                  src={ipfsUrl(photoUrl)}
                  alt="Product preview"
                  style={{ maxWidth: '300px', height: 'auto' }}
                />
              )}
            </View>
          </FormField>
          
          {!isNew && (
            <FormField label="Active Status">
              <Switch 
                name="isActive"
                checked={isActive} 
                onChange={({ checked }) => setIsActive(checked)}
              >
                {isActive ? 'Active' : 'Inactive'}
              </Switch>
            </FormField>
          )}
          
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
            isNew={isNew}
            isSaving={saving}
            isDeleting={deleting}
            onSave={() => handleSubmit()}
            onCancel={() => router.push('/admin/products')}
            onDelete={!isNew ? handleDelete : undefined}
            disabled={!name || !category || !description || !photoUrl || price <= 0}
          />
        </View>
      </View>
    </AdminLayout>
  );
} 