'use client';

import { useState } from 'react';
import { View, TextField, Switch } from 'reshaped';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FormField } from '@/components/admin/FormField';
import { FormError } from '@/components/admin/FormError';
import { AdminFormActions } from '@/components/admin/AdminFormActions';
import { VideoUpload } from '@/components/admin/VideoUpload';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { CategoryInput } from '@/components/admin/CategoryInput';

interface RecipeFormInputs {
  name: string;
  category: string;
  description: string;
  ingredients: string;
  instructions: string;
  isPublished: boolean;
  isFeatured: boolean;
  mediaUrl: string;
  previewImageUrl: string;
}

export default function NewRecipePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // React Hook Form
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RecipeFormInputs>({
    defaultValues: {
      name: '',
      category: '',
      description: '',
      ingredients: '',
      instructions: '',
      isPublished: false,
      isFeatured: false,
      mediaUrl: '',
      previewImageUrl: ''
    }
  });
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

  const onSubmit: SubmitHandler<RecipeFormInputs> = async (data) => {
    setSaving(true);
    setError(null);
    
    try {
      // First create the recipe
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation CreateRecipe($input: CreateRecipeInput!) {
              createRecipe(input: $input) {
                id
                name
                category
                isPublished
              }
            }
          `,
          variables: {
            input: {
              name: data.name,
              category: data.category,
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
        setError(`Failed to create: ${result.errors[0]?.message || 'Unknown error'}`);
        return; // Stay on form when there's an error
      }

      // If featured is checked, set this recipe as featured
      if (data.isFeatured && result.data?.createRecipe?.id) {
        const featuredResponse = await fetch('/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              mutation SetFeaturedRecipe($id: ID!) {
                setFeaturedRecipe(id: $id) {
                  id
                  isFeatured
                }
              }
            `,
            variables: {
              id: result.data.createRecipe.id,
            },
          }),
        });
        
        const featuredResult = await featuredResponse.json();
        if (featuredResult.errors) {
          console.error('Failed to set featured:', featuredResult.errors);
          // Don't fail the whole operation, just log the error
        }
      }

      router.push('/admin/recipes');
    } catch (e) {
      console.error("Failed to create recipe:", e);
      setError("Failed to create. See console for details.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout 
      title="Create New Recipe" 
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
          
          <FormField label="Featured">
            <Switch 
              name="isFeatured"
              checked={formValues.isFeatured} 
              onChange={(e) => setValue('isFeatured', e.checked)}
            >
              {formValues.isFeatured ? 'Featured' : 'Not Featured'}
            </Switch>
          </FormField>
        </View>
        
        <AdminFormActions 
          isNew={true}
          isSaving={saving}
          isDeleting={false}
          onSave={() => handleSubmit(onSubmit)()}
          onCancel={() => router.push('/admin/recipes')}
          disabled={Object.keys(errors).length > 0 || !formValues.name || !formValues.mediaUrl}
        />
      </View>
    </AdminLayout>
  );
} 