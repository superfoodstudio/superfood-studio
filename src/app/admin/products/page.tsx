'use client';

import { useState, useEffect } from 'react';
import { View, Text, Table, Button } from 'reshaped';
import Link from 'next/link';

// Define the expected shape of a product item
interface ProductItem {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly price: number;
  readonly inventory: number;
  readonly isActive: boolean;
  readonly createdAt: string | number | Date;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch products data from GraphQL API
    async function fetchProducts() {
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query GetProducts {
                products {
                  id
                  name
                  category
                  price
                  inventory
                  isActive
                  createdAt
                }
              }
            `,
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message || 'Error fetching products');
        }

        setProducts(result.data.products);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div style={{ background: '#fff', minHeight: '100vh', width: '100%' }}>
      <View direction="column" gap={6} padding={8}>
        <View direction="row" justify="space-between" align="center">
          <Text variant="title-2">Products</Text>
          <Link href="/admin/products/new" passHref>
            <Button>+ New Product</Button>
          </Link>
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
            <Text>Loading products...</Text>
          </View>
        ) : products.length === 0 && !error ? (
          <View padding={4}>
            <Text>No products found.</Text>
          </View>
        ) : (
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Heading>Name</Table.Heading>
                <Table.Heading>Category</Table.Heading>
                <Table.Heading>Price</Table.Heading>
                <Table.Heading>Inventory</Table.Heading>
                <Table.Heading>Status</Table.Heading>
                <Table.Heading>Actions</Table.Heading>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {products.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell>{product.name}</Table.Cell>
                  <Table.Cell>{product.category}</Table.Cell>
                  <Table.Cell>{formatPrice(product.price)}</Table.Cell>
                  <Table.Cell>{product.inventory}</Table.Cell>
                  <Table.Cell>
                    <span 
                      style={{ 
                        color: product.isActive ? '#2e7d32' : '#c62828',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: product.isActive ? '#e8f5e9' : '#ffebee',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <View direction="row" gap={2}>
                      <Link href={`/admin/products/${product.id}`} passHref>
                        <Button size="small" variant="outline">Edit</Button>
                      </Link>
                    </View>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        )}
      </View>
    </div>
  );
} 