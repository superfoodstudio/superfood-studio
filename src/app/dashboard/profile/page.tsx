'use client';

import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { View, Text, Button, Skeleton } from 'reshaped';
import { useLazyLoadQuery, useMutation } from 'react-relay';
import { useForm, SubmitHandler } from 'react-hook-form';
import { usePrivy, useUpdateAccount } from '@privy-io/react-auth';
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
  const { updateEmail } = useUpdateAccount();

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
    <View direction="column" gap={6} padding={6} attributes={{ style: { maxWidth: '500px', margin: '0 auto' } }}>
      <View direction="row" justify="space-between" align="center">
        <Text variant="featured-2" weight="bold">Profile</Text>
        {!isEditing && (
          <Button variant="outline" size="small" onClick={() => setIsEditing(true)}>
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
        padding={5}
        attributes={{
          style: {
            border: '1px solid #e0ddd8',
            borderRadius: '4px',
          },
          onSubmit: handleSubmit(onSubmit)
        }}
      >
        <View direction="column" gap={1}>
          <Text variant="caption-1" color="neutral-faded">First Name</Text>
          {isEditing ? (
            <>
              <input
                {...register('firstName', { required: 'First name is required' })}
                type="text"
                placeholder="First name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e0ddd8',
                  fontSize: '14px',
                  fontFamily: 'var(--font-nunito)',
                }}
              />
              {errors.firstName && (
                <Text variant="caption-1" color="critical">{errors.firstName.message}</Text>
              )}
            </>
          ) : (
            <Text variant="body-2" weight="bold">{data.currentUser.firstName || 'Not set'}</Text>
          )}
        </View>

        <View direction="column" gap={1}>
          <Text variant="caption-1" color="neutral-faded">Last Name</Text>
          {isEditing ? (
            <>
              <input
                {...register('lastName')}
                type="text"
                placeholder="Last name"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #e0ddd8',
                  fontSize: '14px',
                  fontFamily: 'var(--font-nunito)',
                }}
              />
              {errors.lastName && (
                <Text variant="caption-1" color="critical">{errors.lastName.message}</Text>
              )}
            </>
          ) : (
            <Text variant="body-2" weight="bold">{data.currentUser.lastName || 'Not set'}</Text>
          )}
        </View>

        <View direction="column" gap={1}>
          <Text variant="caption-1" color="neutral-faded">Email</Text>
          <View direction="row" align="center" gap={2}>
            <Text variant="body-2" weight="bold">{data.currentUser.email}</Text>
            <Button variant="ghost" size="small" onClick={() => updateEmail()}>
              Change
            </Button>
          </View>
        </View>

        <View direction="column" gap={1}>
          <Text variant="caption-1" color="neutral-faded">Member Since</Text>
          <Text variant="body-2" weight="bold">
            {new Date(data.currentUser.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        {isEditing && (
          <View direction="row" gap={2} justify="end" paddingTop={2}>
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
    <AppContainer maxWidth={600}>
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </AppContainer>
  );
}