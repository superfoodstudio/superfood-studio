'use client';

import { useState, useEffect } from 'react';
import { View, TextField, Switch } from 'reshaped';
import { useRouter, useParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FormField } from '@/components/admin/FormField';
import { FormError } from '@/components/admin/FormError';
import { AdminFormActions } from '@/components/admin/AdminFormActions';
import { VideoUpload } from '@/components/admin/VideoUpload';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { CategoryInput } from '@/components/admin/CategoryInput';

interface Recipe {
  id: string;
  name: string;
  category: string;
  isPublished: boolean;
  uploadDate: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  mediaUrl?: string;
  previewImageUrl?: string;
}

interface RecipeFormInputs {
  name: string;
  category: string;
  description: string;
  ingredients: string;
  instructions: string;
  isPublished: boolean;
  mediaUrl: string;
  previewImageUrl: string;
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
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RecipeFormInputs>();
  const formValues = watch();
  
  const setDescription = (value: string) => {
    setValue('description', value);
  };
  
  const setIngredients = (value: string) => {
    setValue('ingredients', value);
  };
  
  const setInstructions = (value: string) => {
    setValue('instructions', value);
  };
  
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
                  mediaUrl
                  previewImageUrl
                }
              }
            `,
            variables: { id },
          }),
        });
        
        const result = await response.json();
        
        if (result.data && result.data.recipe) {
          const recipeData = result.data.recipe;
          setRecipe(recipeData);
          
          // Initialize form with recipe data
          setValue('name', recipeData.name || '');
          setValue('category', recipeData.category || '');
          setValue('description', recipeData.description || '');
          setValue('ingredients', recipeData.ingredients || '');
          setValue('instructions', recipeData.instructions || '');
          setValue('isPublished', recipeData.isPublished || false);
          setValue('mediaUrl', recipeData.mediaUrl || '');
          setValue('previewImageUrl', recipeData.previewImageUrl || '');
          
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
              mediaUrl: data.mediaUrl,
              previewImageUrl: data.previewImageUrl,
              // Store as rich text content instead of arrays
              ingredients: data.ingredients,
              instructions: data.instructions,
            },
          },
        }),
      });
      
      const result = await response.json();
      
      if (result.errors) {
        setError(`Failed to update: ${result.errors[0]?.message || 'Unknown error'}`);
        return; // Stay on form when there's an error
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
        setDeleting(false);
      } else {
        router.push('/admin/recipes');
      }
    } catch (e) {
      console.error("Failed to delete recipe:", e);
      setError("Failed to delete. See console for details.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Loading Recipe...">
        <View padding={4}>Loading recipe data...</View>
      </AdminLayout>
    );
  }

  if (!recipe && !loading) {
    return (
      <AdminLayout title="Recipe Not Found" backUrl="/admin/recipes">
        <View padding={4}>The requested recipe was not found.</View>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Edit Recipe" 
      backUrl="/admin/recipes"
    >
      <View 
        as="form" 
        gap={6} 
        width="100%" 
        attributes={{ 
          onSubmit: handleSubmit(onSubmit) 
        }}
      >
        <FormError error={error} />
        
        <View gap={4} maxWidth="800px" width="100%">
          <FormField label="Recipe Name" required error={errors.name?.message}>
            <TextField 
              name="name"
              value={formValues.name || ''}
              onChange={({ value }) => setValue('name', value)}
              placeholder="Enter recipe name"
            />
          </FormField>
          
          <FormField label="Category" required error={errors.category?.message}>
            <CategoryInput
              value={formValues.category || ''}
              onChange={(value) => setValue('category', value)}
              placeholder="Select or create a category..."
              disabled={saving}
              entityType="recipe"
            />
          </FormField>
          
          <FormField label="Description" error={errors.description?.message}>
            <RichTextEditor
              value={formValues.description || ''}
              onChange={setDescription}
              placeholder="Describe your recipe..."
            />
          </FormField>
          
          <FormField label="Video/Audio Content" required error={errors.mediaUrl?.message}>
            <VideoUpload
              value={formValues.mediaUrl}
              onChange={(url) => setValue('mediaUrl', url)}
              disabled={saving}
            />
          </FormField>
          
          <FormField label="Preview Image (for recipe cards)" error={errors.previewImageUrl?.message}>
            <ImageUpload
              value={formValues.previewImageUrl}
              onChange={(url) => setValue('previewImageUrl', url)}
              disabled={saving}
              label="Upload Preview Image"
            />
          </FormField>
          
          <FormField label="Ingredients" required error={errors.ingredients?.message}>
            <RichTextEditor
              value={formValues.ingredients || ''}
              onChange={setIngredients}
              placeholder="Enter one ingredient per line"
            />
          </FormField>
          
          <FormField label="Instructions" required error={errors.instructions?.message}>
            <RichTextEditor
              value={formValues.instructions || ''}
              onChange={setInstructions}
              placeholder="Enter one instruction step per line"
            />
          </FormField>
          
          <FormField label="Published">
            <Switch 
              name="isPublished"
              checked={formValues.isPublished} 
              onChange={(e) => setValue('isPublished', e.checked)}
            >
              {formValues.isPublished ? 'Published' : 'Draft'}
            </Switch>
          </FormField>
        </View>
        
        <AdminFormActions 
          isNew={false}
          isSaving={saving}
          isDeleting={deleting}
          onSave={() => handleSubmit(onSubmit)()}
          onCancel={() => router.push('/admin/recipes')}
          onDelete={handleDelete}
          disabled={Object.keys(errors).length > 0}
        />
      </View>
    </AdminLayout>
  );
} 