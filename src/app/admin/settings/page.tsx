'use client';

import { useState, Suspense } from 'react';
import { View, Button, Text, TextArea } from 'reshaped';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FormField } from '@/components/admin/FormField';
import { FormError } from '@/components/admin/FormError';
import { VideoUpload } from '@/components/admin/VideoUpload';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useLazyLoadQuery, useMutation } from 'react-relay';
import { SiteSettingsQuery, UpdateSiteSettingsMutation } from '@/graphql/queries/SiteSettingsQueries';
import type { SiteSettingsQueriesQuery } from '@/__generated__/SiteSettingsQueriesQuery.graphql';
import type { SiteSettingsQueriesUpdateMutation } from '@/__generated__/SiteSettingsQueriesUpdateMutation.graphql';

interface SiteSettingsFormInputs {
  homepageVideoUrl: string;
  weeklyGroceryList: string;
}

function SiteSettingsContent() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data = useLazyLoadQuery<SiteSettingsQueriesQuery>(
    SiteSettingsQuery,
    {},
    { fetchPolicy: 'store-or-network' }
  );

  const [updateSiteSettings] = useMutation<SiteSettingsQueriesUpdateMutation>(UpdateSiteSettingsMutation);

  // React Hook Form
  const { handleSubmit, setValue, watch, formState: { errors } } = useForm<SiteSettingsFormInputs>({
    defaultValues: {
      homepageVideoUrl: data.siteSettings?.homepageVideoUrl || '',
      weeklyGroceryList: data.siteSettings?.weeklyGroceryList || ''
    }
  });
  
  const formValues = watch();

  const onSubmit: SubmitHandler<SiteSettingsFormInputs> = (formData) => {
    setSaving(true);
    setError(null);
    
    updateSiteSettings({
      variables: {
        input: {
          homepageVideoUrl: formData.homepageVideoUrl || null,
          weeklyGroceryList: formData.weeklyGroceryList || null,
        },
      },
      onCompleted: () => {
        setSaving(false);
        setError(null);
      },
      onError: (error) => {
        setSaving(false);
        setError(error.message);
      },
    });
  };

  return (
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
        <FormField label="Homepage Video" error={errors.homepageVideoUrl?.message}>
          <VideoUpload
            value={formValues.homepageVideoUrl}
            onChange={(url) => setValue('homepageVideoUrl', url)}
            disabled={saving}
          />
        </FormField>
        
        <FormField label="Weekly Grocery List" error={errors.weeklyGroceryList?.message}>
          <RichTextEditor
            value={formValues.weeklyGroceryList}
            onChange={(value) => setValue('weeklyGroceryList', value)}
            placeholder="Enter the weekly grocery list content here..."
            disabled={saving}
          />
        </FormField>
      </View>
      
      <View direction="row" gap={3}>
        <Button 
          type="submit" 
          variant="solid" 
          disabled={saving || Object.keys(errors).length > 0}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </View>
    </View>
  );
}

function SiteSettingsLoading() {
  return (
    <View padding={4}>
      <Text>Loading site settings...</Text>
    </View>
  );
}

export default function AdminSettingsPage() {
  return (
    <AdminLayout title="Site Settings">
      <Suspense fallback={<SiteSettingsLoading />}>
        <SiteSettingsContent />
      </Suspense>
    </AdminLayout>
  );
}