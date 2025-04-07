'use client';

import { useState, useEffect } from 'react';
import { View, Text, Button } from 'reshaped';
import { useRouter, useParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';

interface Recipe {
  id: string;
  name: string;
  category: string;
  isPublished: boolean;
  uploadDate: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
}

interface RecipeFormInputs {
  name: string;
  category: string;
  description: string;
  ingredients: string;
  instructions: string;
  isPublished: boolean;
}

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // React Hook Form
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<RecipeFormInputs>();
  
  useEffect(() => {
    async function fetchRecipe() {
      try {
        const response = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query GetRecipe($id: ID!) {
                recipe(id: $id) {
                  id
                  name
                  category
                  isPublished
                  uploadDate
                  description
                  ingredients
                  instructions
                }
              }
            `,
            variables: { id },
          }),
        });
        
        const result = await response.json();
        console.log("Recipe fetch result:", result);
        
        if (result.data && result.data.recipe) {
          const recipeData = result.data.recipe;
          setRecipe(recipeData);
          
          // Initialize form with recipe data
          setValue('name', recipeData.name || '');
          setValue('category', recipeData.category || '');
          setValue('description', recipeData.description || '');
          setValue('ingredients', recipeData.ingredients ? recipeData.ingredients.join('\n') : '');
          setValue('instructions', recipeData.instructions ? recipeData.instructions.join('\n') : '');
          setValue('isPublished', recipeData.isPublished || false);
          
        } else if (result.errors) {
          setError(`GraphQL error: ${result.errors[0]?.message || 'Unknown error'}`);
        } else {
          setError('Recipe not found');
        }
      } catch (e) {
        console.error("Failed to fetch recipe:", e);
        setError("Failed to load recipe. See console for details.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchRecipe();
  }, [id, setValue]);

  const onSubmit: SubmitHandler<RecipeFormInputs> = async (data) => {
    setSaving(true);
    setError(null);
    
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation UpdateRecipe($id: ID!, $input: UpdateRecipeInput!) {
              updateRecipe(id: $id, input: $input) {
                id
                name
                category
                isPublished
              }
            }
          `,
          variables: {
            id,
            input: {
              name: data.name,
              category: data.category,
              isPublished: data.isPublished,
              description: data.description,
              // Convert newline-separated strings to arrays for ingredients and instructions
              ingredients: data.ingredients.split('\n').filter(Boolean),
              instructions: data.instructions.split('\n').filter(Boolean),
            },
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.errors) {
        setError(`Failed to update: ${result.errors[0]?.message || 'Unknown error'}`);
      } else {
        router.push('/admin/recipes');
      }
    } catch (e) {
      console.error("Failed to update recipe:", e);
      setError("Failed to update. See console for details.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
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
            mutation DeleteRecipe($id: ID!) {
              deleteRecipe(id: $id) {
                success
              }
            }
          `,
          variables: { id },
        }),
      });
      
      const result = await response.json();
      
      if (result.errors) {
        setError(`Failed to delete: ${result.errors[0]?.message || 'Unknown error'}`);
      } else {
        router.push('/admin/recipes');
      }
    } catch (e) {
      console.error("Failed to delete recipe:", e);
      setError("Failed to delete. See console for details.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh', width: '100%' }}>
        <View direction="column" gap={6} padding={8}>
          <Text variant="title-2">Loading recipe...</Text>
        </View>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh', width: '100%' }}>
        <View direction="column" gap={6} padding={8}>
          <Text variant="title-2">Error</Text>
          <div style={{ backgroundColor: '#ffebee', padding: '16px', borderRadius: '4px' }}>
            <Text>
              <span style={{ color: '#c62828' }}>{error}</span>
            </Text>
          </div>
          <Button onClick={() => router.push('/admin/recipes')}>Back to Recipes</Button>
        </View>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh', width: '100%' }}>
        <View direction="column" gap={6} padding={8}>
          <Text variant="title-2">Recipe not found</Text>
          <Button onClick={() => router.push('/admin/recipes')}>Back to Recipes</Button>
        </View>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh', width: '100%' }}>
      <View direction="column" gap={6} padding={8}>
        <View direction="row" justify="space-between" align="center">
          <Text variant="title-2">Edit Recipe</Text>
          <View direction="row" gap={2}>
            <Button 
              variant="outline" 
              onClick={() => router.push('/admin/recipes')}
            >
              Cancel
            </Button>
            <Button 
              variant="solid" 
              color="critical" 
              disabled={deleting} 
              onClick={handleDelete}
            >
              {deleting ? 'Deleting...' : 'Delete Recipe'}
            </Button>
          </View>
        </View>
        
        {error && (
          <div style={{ backgroundColor: '#ffebee', padding: '16px', borderRadius: '4px' }}>
            <Text>
              <span style={{ color: '#c62828' }}>{error}</span>
            </Text>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <View direction="column" gap={6}>
            <div>
              <label className="form-label">Recipe Name</label>
              <input 
                {...register('name', { required: true })}
                className="form-input"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  marginTop: '8px'
                }}
              />
              {errors.name && <p className="error-text">Name is required</p>}
            </div>
            
            <div>
              <label className="form-label">Category</label>
              <select 
                {...register('category')}
                className="form-select"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  marginTop: '8px'
                }}
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="dessert">Dessert</option>
                <option value="snack">Snack</option>
                <option value="drink">Drink</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">Description</label>
              <textarea 
                {...register('description')}
                className="form-textarea"
                rows={3}
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  marginTop: '8px'
                }}
              />
            </div>
            
            <div>
              <label className="form-label">Ingredients (one per line)</label>
              <textarea 
                {...register('ingredients')}
                className="form-textarea"
                rows={5}
                placeholder="Enter ingredients, one per line"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  marginTop: '8px'
                }}
              />
            </div>
            
            <div>
              <label className="form-label">Instructions (one per line)</label>
              <textarea 
                {...register('instructions')}
                className="form-textarea"
                rows={5}
                placeholder="Enter instructions, one per line"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  fontSize: '16px',
                  marginTop: '8px'
                }}
              />
            </div>
            
            <div>
              <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  {...register('isPublished')} 
                  style={{ marginRight: '8px' }}
                />
                <span>Published</span>
              </label>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </View>
        </form>
      </View>
    </div>
  );
} 