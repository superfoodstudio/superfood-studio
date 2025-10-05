'use client';

import { useState, Suspense, useCallback } from 'react';
import { View, Text, Button, Divider, Modal, useToggle } from 'reshaped';
import { useLazyLoadQuery, useMutation, usePaginationFragment } from 'react-relay';
import { useForm, SubmitHandler } from 'react-hook-form';
import { RecipeCommentsQuery, RecipeCommentsPaginationFragment, CreateCommentMutation } from '@/graphql/queries/CommentQueries';
import { CurrentUserQuery } from '@/graphql/queries/UserQueries';
import { LoadMore } from '@/components/ui/LoadMore';
import type { CommentQueriesRecipeCommentsQuery } from '@/__generated__/CommentQueriesRecipeCommentsQuery.graphql';
import type { CommentQueriesRecipeCommentsPaginationFragment$key } from '@/__generated__/CommentQueriesRecipeCommentsPaginationFragment.graphql';
import type { CommentQueriesCreateMutation } from '@/__generated__/CommentQueriesCreateMutation.graphql';
import type { UserQueriesCurrentUserQuery } from '@/__generated__/UserQueriesCurrentUserQuery.graphql';

interface CommentFormInputs {
  content: string;
}

interface RecipeCommentsContentProps {
  recipeId: string;
}

function RecipeCommentsContent({ recipeId }: RecipeCommentsContentProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { active: isModalOpen, activate: openModal, deactivate: closeModal } = useToggle(false);

  const queryData = useLazyLoadQuery<CommentQueriesRecipeCommentsQuery>(
    RecipeCommentsQuery,
    { recipeId, first: 10 },
    { fetchPolicy: 'store-or-network' }
  );

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    CommentQueriesRecipeCommentsQuery,
    CommentQueriesRecipeCommentsPaginationFragment$key
  >(RecipeCommentsPaginationFragment, queryData);

  const userData = useLazyLoadQuery<UserQueriesCurrentUserQuery>(
    CurrentUserQuery,
    {},
    { fetchPolicy: 'store-or-network' }
  );

  const handleLoadMore = useCallback(() => {
    if (!isLoadingNext && hasNext) {
      loadNext(10);
    }
  }, [loadNext, isLoadingNext, hasNext]);

  const [createComment] = useMutation<CommentQueriesCreateMutation>(CreateCommentMutation);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CommentFormInputs>();

  const onSubmit: SubmitHandler<CommentFormInputs> = (formData) => {
    if (!formData.content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    if (formData.content.trim().length > 500) {
      setError('Comment cannot exceed 500 characters');
      return;
    }

    if (!userData.currentUser) {
      setError('You must be logged in to comment');
      return;
    }

    setSubmitting(true);
    setError(null);

    const authorName = `${userData.currentUser.firstName} ${userData.currentUser.lastName}`.trim();

    createComment({
      variables: {
        input: {
          content: formData.content.trim(),
          author: authorName,
          email: userData.currentUser.email,
          recipeId: recipeId,
        },
      },
      onCompleted: () => {
        setSubmitting(false);
        reset();
        setError(null);
        closeModal();
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

  const comments = data.recipeCommentsConnection?.edges || [];
  const totalCount = data.recipeCommentsConnection?.totalCount || 0;

  return (
    <View direction="column" gap={6}>
      <View direction="row" justify="space-between" align="center">
        <View direction="column" gap={2}>
          <Text variant="featured-3">Comments ({totalCount})</Text>
          <Text variant="body-3" color="neutral-faded">
            Share your thoughts about this recipe
          </Text>
        </View>
        <Button variant="ghost" onClick={openModal}>
          Leave a comment
        </Button>
      </View>

      {/* Comment Modal */}
      <Modal
        active={isModalOpen}
        onClose={closeModal}
        size="medium"
      >
        <View
          as="form"
          direction="column"
          gap={4}
          padding={6}
          attributes={{
            onSubmit: handleSubmit(onSubmit)
          }}
        >
          <Text variant="title-6">Leave a Comment</Text>

          {error && (
            <View
              padding={3}
              backgroundColor="critical-faded"
              borderRadius="small"
            >
              <Text variant="body-2" color="critical">{error}</Text>
            </View>
          )}

          <View>
            <Text variant="body-3" weight="medium">Comment *</Text>
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

          <View direction="row" gap={2} justify="end">
            <Button
              variant="ghost"
              onClick={closeModal}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="solid"
              disabled={submitting}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </View>
        </View>
      </Modal>

      {/* Comments List */}
      <View direction="column" gap={4}>
        {comments.length === 0 ? (
          <View padding={6} align="center">
            <Text variant="body-2" color="neutral-faded">
              No comments yet. Be the first to share your thoughts!
            </Text>
          </View>
        ) : (
          comments.map(({ node: comment }) => (
            <View key={comment.id} direction="column" gap={2}>
              <View direction="row" justify="space-between" align="center">
                <Text variant="body-2" weight="medium">{comment.author}</Text>
                <Text variant="caption-1" color="neutral-faded">
                  {formatDate(comment.createdAt)}
                </Text>
              </View>
              <Text variant="body-2">{comment.content}</Text>
              <Divider />
            </View>
          ))
        )}
      </View>

      {/* Load More Component */}
      <LoadMore
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
        onLoadMore={handleLoadMore}
      />
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