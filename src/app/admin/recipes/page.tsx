'use client';

import { useState, useEffect } from 'react';
import { View, Text, Table, Button } from 'reshaped';
import Link from 'next/link';

// Define the expected shape of a recipe item based on the query
interface RecipeItem {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly isPublished: boolean;
  readonly uploadDate: string | number | Date;
}

export default function AdminRecipesPage() {
  const [error, setError] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<RecipeItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch data directly from the GraphQL endpoint
  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query {
                recipes {
                  id
                  name
                  category
                  isPublished
                  uploadDate
                }
              }
            `,
          }),
        });
        
        const result = await response.json();
        console.log("GraphQL query result:", result);
        
        if (result.data && result.data.recipes) {
          setRecipes(result.data.recipes);
        } else if (result.errors) {
          setError(`GraphQL error: ${result.errors[0]?.message || 'Unknown error'}`);
        }
      } catch (e) {
        console.error("Failed to fetch recipes:", e);
        setError("Failed to load recipes. See console for details.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchRecipes();
  }, []);

  return (
    <div style={{ background: '#fff', minHeight: '100vh', width: '100%' }}>
      <View direction="column" gap={6} padding={8}>
        <View direction="row" justify="space-between" align="center">
          <Text variant="title-2">Manage Recipes</Text>
          <Link href="/admin/recipes/new" passHref>
            <Button>Create New Recipe</Button>
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
            <Text>Loading recipes...</Text>
          </View>
        ) : recipes.length === 0 && !error ? (
          <View padding={4}>
            <Text>No recipes found.</Text>
          </View>
        ) : (
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Heading>Name</Table.Heading>
                <Table.Heading>Category</Table.Heading>
                <Table.Heading>Published</Table.Heading>
                <Table.Heading>Upload Date</Table.Heading>
                <Table.Heading>Actions</Table.Heading>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {recipes.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.category}</Table.Cell>
                  <Table.Cell>{item.isPublished ? 'Yes' : 'No'}</Table.Cell>
                  <Table.Cell>{new Date(item.uploadDate).toLocaleDateString()}</Table.Cell>
                  <Table.Cell>
                    <View direction="row" gap={2}>
                      <Button variant="outline" size="small">Edit</Button>
                      <Button variant="solid" color="critical" size="small">Delete</Button>
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