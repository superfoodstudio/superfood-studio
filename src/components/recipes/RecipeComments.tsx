'use client';

import { useState, Suspense } from 'react';
import { View, Text, Button, Divider } from 'reshaped';
import { useLazyLoadQuery, useMutation } from 'react-relay';
import { useForm, SubmitHandler } from 'react-hook-form';
import { RecipeCommentsQuery, CreateCommentMutation } from '@/graphql/queries/CommentQueries';
import type { CommentQueriesRecipeCommentsQuery } from '@/__generated__/CommentQueriesRecipeCommentsQuery.graphql';
import type { CommentQueriesCreateMutation } from '@/__generated__/CommentQueriesCreateMutation.graphql';

interface CommentFormInputs {
  content: string;
  author: string;
  email?: string;
}

interface RecipeCommentsContentProps {
  recipeId: string;
}

function RecipeCommentsContent({ recipeId }: RecipeCommentsContentProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data = useLazyLoadQuery<CommentQueriesRecipeCommentsQuery>(
    RecipeCommentsQuery,
    { recipeId },
    { fetchPolicy: 'store-or-network' }
  );

  const [createComment] = useMutation<CommentQueriesCreateMutation>(CreateCommentMutation);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CommentFormInputs>();

  const onSubmit: SubmitHandler<CommentFormInputs> = (formData) => {
    if (!formData.content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (formData.content.trim().length > 500) {
      setError('Comment cannot exceed 500 characters');
      return;
    }

    setSubmitting(true);
    setError(null);

    createComment({
      variables: {
        input: {
          content: formData.content.trim(),
          author: formData.author.trim(),
          email: formData.email?.trim(),
          recipeId: recipeId,
        },
      },
      onCompleted: () => {
        setSubmitting(false);
        reset();
        setError(null);
      },
      onError: (error) => {
        setSubmitting(false);
        setError(error.message);
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View direction="column" gap={6}>
      <View direction="column" gap={2}>
        <Text variant="title-2">Comments ({data.recipeComments.length})</Text>
        <Text variant="body-2" color="neutral-faded">
          Share your thoughts about this recipe
        </Text>
      </View>

      {/* Comment Form */}
      <View 
        as="form" 
        direction="column" 
        gap={4}
        padding={4}
        backgroundColor="neutral-faded"
        attributes={{
          style: { borderRadius: '8px' },
          onSubmit: handleSubmit(onSubmit)
        }}
      >
        <Text variant="title-4">Leave a Comment</Text>
        
        {error && (
          <View 
            padding={3} 
            backgroundColor="critical-faded"
            attributes={{ style: { borderRadius: '4px' } }}
          >
            <Text variant="body-2" color="critical">{error}</Text>
          </View>
        )}

        <View direction="row" gap={3}>
          <View attributes={{ style: { flex: 1 } }}>
            <Text variant="body-2" weight="medium">Name *</Text>
            <input
              {...register('author', { required: 'Name is required' })}
              type="text"
              placeholder="Your name"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                fontSize: '14px'
              }}
            />
            {errors.author && (
              <Text variant="caption-1" color="critical">{errors.author.message}</Text>
            )}
          </View>
          
          <View attributes={{ style: { flex: 1 } }}>
            <Text variant="body-2" weight="medium">Email (optional)</Text>
            <input
              {...register('email')}
              type="email"
              placeholder="your@email.com"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                fontSize: '14px'
              }}
            />
          </View>
        </View>

        <View>
          <Text variant="body-2" weight="medium">Comment *</Text>
          <textarea
            {...register('content', { required: 'Comment is required', maxLength: 500 })}
            placeholder="Share your thoughts about this recipe..."
            rows={4}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
          />
          {errors.content && (
            <Text variant="caption-1" color="critical">{errors.content.message}</Text>
          )}
        </View>

        <Button 
          type="submit" 
          variant="solid" 
          disabled={submitting}
        >
          {submitting ? 'Posting...' : 'Post Comment'}
        </Button>
      </View>

      {/* Comments List */}
      <View direction="column" gap={4}>
        {data.recipeComments.length === 0 ? (
          <View padding={6} align="center">
            <Text variant="body-1" color="neutral-faded">
              No comments yet. Be the first to share your thoughts!
            </Text>
          </View>
        ) : (
          data.recipeComments.map((comment) => (
            <View key={comment.id} direction="column" gap={2}>
              <View direction="row" justify="space-between" align="center">
                <Text variant="body-2" weight="medium">{comment.author}</Text>
                <Text variant="caption-1" color="neutral-faded">
                  {formatDate(comment.createdAt)}
                </Text>
              </View>
              <Text variant="body-1">{comment.content}</Text>
              <Divider />
            </View>
          ))
        )}
      </View>
    </View>
  );
}

function RecipeCommentsLoading() {
  return (
    <View direction="column" gap={4}>
      <Text variant="title-2">Comments</Text>
      <View padding={4}>
        <Text>Loading comments...</Text>
      </View>
    </View>
  );
}

interface RecipeCommentsProps {
  recipeId: string;
}

export function RecipeComments({ recipeId }: RecipeCommentsProps) {
  return (
    <Suspense fallback={<RecipeCommentsLoading />}>
      <RecipeCommentsContent recipeId={recipeId} />
    </Suspense>
  );
}