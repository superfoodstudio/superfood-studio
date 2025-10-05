'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { View, Text, Button, Skeleton } from 'reshaped';
import { useLazyLoadQuery, useMutation } from 'react-relay';
import { useForm, SubmitHandler } from 'react-hook-form';
import { usePrivy } from '@privy-io/react-auth';
import { AppContainer } from '@/components/layout/AppContainer';
import { CurrentUserQuery, UpdateUserMutation } from '@/graphql/queries/UserQueries';
import type { UserQueriesCurrentUserQuery } from '@/__generated__/UserQueriesCurrentUserQuery.graphql';
import type { UserQueriesUpdateUserMutation } from '@/__generated__/UserQueriesUpdateUserMutation.graphql';

interface ProfileFormInputs {
  firstName: string;
  lastName: string;
  email: string;
}

function ProfileContent() {
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const data = useLazyLoadQuery<UserQueriesCurrentUserQuery>(
    CurrentUserQuery,
    {},
    { fetchPolicy: 'store-or-network' }
  );

  const [updateUser, isUpdating] = useMutation<UserQueriesUpdateUserMutation>(UpdateUserMutation);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormInputs>({
    defaultValues: {
      firstName: data.currentUser?.firstName || '',
      lastName: data.currentUser?.lastName || '',
      email: data.currentUser?.email || '',
    }
  });

  const onSubmit: SubmitHandler<ProfileFormInputs> = (formData) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    updateUser({
      variables: {
        input: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
        },
      },
      optimisticResponse: {
        updateUser: {
          id: data.currentUser?.id || '',
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          updatedAt: new Date().toISOString(),
        },
      },
      onCompleted: () => {
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccessMessage(null), 3000);
      },
      onError: (error) => {
        setErrorMessage(error.message || 'Failed to update profile');
      },
    });
  };

  const handleCancel = () => {
    reset({
      firstName: data.currentUser?.firstName || '',
      lastName: data.currentUser?.lastName || '',
      email: data.currentUser?.email || '',
    });
    setIsEditing(false);
    setErrorMessage(null);
  };

  if (!data.currentUser) {
    return (
      <View direction="column" align="center" padding={8}>
        <Text variant="body-2">No user data available</Text>
      </View>
    );
  }

  return (
    <View direction="column" gap={6} padding={6}>
      <View direction="row" justify="space-between" align="center">
        <Text variant="title-5">Profile Settings</Text>
        {!isEditing && (
          <Button variant="solid" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </View>

      {successMessage && (
        <View padding={3} backgroundColor="positive-faded" borderRadius="small">
          <Text variant="body-2" color="positive">{successMessage}</Text>
        </View>
      )}

      {errorMessage && (
        <View padding={3} backgroundColor="critical-faded" borderRadius="small">
          <Text variant="body-2" color="critical">{errorMessage}</Text>
        </View>
      )}

      <View
        as="form"
        direction="column"
        gap={4}
        padding={6}
        backgroundColor="neutral-faded"
        borderRadius="medium"
        attributes={{
          onSubmit: handleSubmit(onSubmit)
        }}
      >
        <View direction="column" gap={2}>
          <Text variant="body-3" weight="medium">First Name</Text>
          {isEditing ? (
            <>
              <input
                {...register('firstName', { required: 'First name is required' })}
                type="text"
                placeholder="First name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontFamily: 'var(--font-nunito)',
                }}
              />
              {errors.firstName && (
                <Text variant="caption-1" color="critical">{errors.firstName.message}</Text>
              )}
            </>
          ) : (
            <Text variant="body-2">{data.currentUser.firstName || 'Not set'}</Text>
          )}
        </View>

        <View direction="column" gap={2}>
          <Text variant="body-3" weight="medium">Last Name</Text>
          {isEditing ? (
            <>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                type="text"
                placeholder="Last name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontFamily: 'var(--font-nunito)',
                }}
              />
              {errors.lastName && (
                <Text variant="caption-1" color="critical">{errors.lastName.message}</Text>
              )}
            </>
          ) : (
            <Text variant="body-2">{data.currentUser.lastName || 'Not set'}</Text>
          )}
        </View>

        <View direction="column" gap={2}>
          <Text variant="body-3" weight="medium">Email</Text>
          {isEditing ? (
            <>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                type="email"
                placeholder="email@example.com"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  fontSize: '14px',
                  fontFamily: 'var(--font-nunito)',
                }}
              />
              {errors.email && (
                <Text variant="caption-1" color="critical">{errors.email.message}</Text>
              )}
            </>
          ) : (
            <Text variant="body-2">{data.currentUser.email}</Text>
          )}
        </View>

        <View direction="column" gap={2}>
          <Text variant="body-3" weight="medium">Member Since</Text>
          <Text variant="body-2" color="neutral-faded">
            {new Date(data.currentUser.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        {isEditing && (
          <View direction="row" gap={2} justify="end">
            <Button variant="ghost" onClick={handleCancel} type="button">
              Cancel
            </Button>
            <Button type="submit" variant="solid" disabled={isUpdating}>
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}

function ProfileSkeleton() {
  return (
    <View direction="column" gap={6} padding={6}>
      <Skeleton height="2rem" width="200px" />
      <View direction="column" gap={4} padding={6} borderRadius="medium">
        <Skeleton height="1rem" width="100px" />
        <Skeleton height="2.5rem" width="100%" />
        <Skeleton height="1rem" width="100px" />
        <Skeleton height="2.5rem" width="100%" />
        <Skeleton height="1rem" width="100px" />
        <Skeleton height="2.5rem" width="100%" />
      </View>
    </View>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated, router]);

  if (!ready || !authenticated) {
    return (
      <AppContainer>
        <ProfileSkeleton />
      </AppContainer>
    );
  }

  return (
    <AppContainer maxWidth={800}>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </AppContainer>
  );
}