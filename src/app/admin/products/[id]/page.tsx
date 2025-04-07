'use client';

import { useState, useEffect } from 'react';
import { View, Text, Button } from 'reshaped';
import { useParams, useRouter } from 'next/navigation';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params?.id === 'new';
  const productId = isNew ? null : params?.id as string;

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoading(false);
      }
    }

    fetchProduct();
  }, [isNew, productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // Navigate back to products list on success
      router.push('/admin/products');
    } catch (err) {
      console.error('Error saving product:', err);
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
              deleteProduct(id: $id)
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
      }

      // Navigate back to products list on success
      router.push('/admin/products');
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setDeleting(false);
    }
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', width: '100%' }}>
      <View direction="column" gap={6} padding={8}>
        <View direction="row" justify="space-between" align="center">
          <Text variant="title-2">{isNew ? 'Create New Product' : 'Edit Product'}</Text>
          <View direction="row" gap={2}>
            <Button variant="outline" onClick={() => router.push('/admin/products')}>
              Cancel
            </Button>
            {!isNew && (
              <Button variant="outline" color="critical" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </View>
        </View>

        {error && (
          <div style={{ backgroundColor: '#ffebee', padding: '16px', borderRadius: '4px' }}>
            <Text>
              <span style={{ color: '#c62828' }}>{error}</span>
            </Text>
          </div>
        )}

        {loading ? (
          <View padding={4}>
            <Text>Loading product...</Text>
          </View>
        ) : (
          <form onSubmit={handleSubmit}>
            <View direction="column" gap={4}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Product Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                >
                  <option value="">Select category</option>
                  <option value="APPAREL">Apparel</option>
                  <option value="WELLNESS">Wellness</option>
                  <option value="ACCESSORIES">Accessories</option>
                  <option value="FOOD">Food</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Photo URL *
                </label>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Video URL (optional)
                </label>
                <input
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>

              <View direction="row" gap={4}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Inventory *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={inventory}
                    onChange={(e) => setInventory(parseInt(e.target.value))}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>
              </View>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. organic, vegan, natural"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  Product is active (visible in store)
                </label>
              </div>

              <View direction="row" justify="end" padding={4}>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : isNew ? 'Create Product' : 'Update Product'}
                </Button>
              </View>
            </View>
          </form>
        )}
      </View>
    </div>
  );
} 