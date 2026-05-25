"use client";

import { useState, Suspense, useCallback } from "react";
import { View, Text, Button, Divider, Modal, useToggle, Skeleton } from "reshaped";
import {
  useLazyLoadQuery,
  useMutation,
  usePaginationFragment,
} from "react-relay";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  RecipeCommentsQuery,
  RecipeCommentsPaginationFragment,
  CreateCommentMutation,
} from "@/graphql/queries/CommentQueries";
import { CurrentUserQuery } from "@/graphql/queries/UserQueries";
import { LoadMore } from "@/components/ui/LoadMore";
import type { CommentQueriesRecipeCommentsQuery } from "@/__generated__/CommentQueriesRecipeCommentsQuery.graphql";
import type { CommentQueriesRecipeCommentsPaginationFragment$key } from "@/__generated__/CommentQueriesRecipeCommentsPaginationFragment.graphql";
import type { CommentQueriesCreateMutation } from "@/__generated__/CommentQueriesCreateMutation.graphql";
import type { UserQueriesCurrentUserQuery } from "@/__generated__/UserQueriesCurrentUserQuery.graphql";

interface CommentFormInputs {
  content: string;
}

interface RecipeCommentsContentProps {
  recipeId: string;
}

function RecipeCommentsContent({ recipeId }: RecipeCommentsContentProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    active: isModalOpen,
    activate: openModal,
    deactivate: closeModal,
  } = useToggle(false);

  const queryData = useLazyLoadQuery<CommentQueriesRecipeCommentsQuery>(
    RecipeCommentsQuery,
    { recipeId, first: 10 },
    { fetchPolicy: "store-or-network" },
  );

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment<
    CommentQueriesRecipeCommentsQuery,
    CommentQueriesRecipeCommentsPaginationFragment$key
  >(RecipeCommentsPaginationFragment, queryData);

  const userData = useLazyLoadQuery<UserQueriesCurrentUserQuery>(
    CurrentUserQuery,
    {},
    { fetchPolicy: "store-or-network" },
  );

  const handleLoadMore = useCallback(() => {
    if (!isLoadingNext && hasNext) {
      loadNext(10);
    }
  }, [loadNext, isLoadingNext, hasNext]);

  const [createComment] = useMutation<CommentQueriesCreateMutation>(
    CreateCommentMutation,
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormInputs>();

  const onSubmit: SubmitHandler<CommentFormInputs> = (formData) => {
    if (!formData.content.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    if (formData.content.trim().length > 500) {
      setError("Comment cannot exceed 500 characters");
      return;
    }

    if (!userData.currentUser) {
      setError("You must be logged in to comment");
      return;
    }

    setSubmitting(true);
    setError(null);

    const firstName = userData.currentUser.firstName || '';
    const lastName = userData.currentUser.lastName || '';
    const fullName = [firstName, lastName].filter(Boolean).join(' ');
    // Generate a short hash from the user ID for anonymous display names
    const userHash = userData.currentUser.id?.slice(-4).toUpperCase() || '0000';
    const authorName = fullName || `Superfoodie #${userHash}`;

    createComment({
      variables: {
        input: {
          content: formData.content.trim(),
          author: authorName,
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
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const comments = data.recipeCommentsConnection?.edges || [];
  const totalCount = data.recipeCommentsConnection?.totalCount || 0;

  return (
    <View direction="column" gap={6}>
      <View direction="row" justify="space-between" align="center">
        <View direction="column" gap={2}>
          <Text variant="featured-3">Comments ({totalCount})</Text>
        </View>
        <Button variant="ghost" onClick={openModal}>
          Leave a comment
        </Button>
      </View>

      {/* Comment Modal */}
      <Modal active={isModalOpen} onClose={closeModal} size={"500px"}>
        <View
          as="form"
          direction="column"
          gap={4}
          padding={6}
          attributes={{
            onSubmit: handleSubmit(onSubmit),
          }}
        >
          <Text variant="featured-3">Leave a Comment</Text>

          {error && (
            <View
              padding={3}
              backgroundColor="critical-faded"
              borderRadius="small"
            >
              <Text variant="body-2" color="critical">
                {error}
              </Text>
            </View>
          )}

          <View>
            <textarea
              {...register("content", {
                required: "Comment is required",
                maxLength: 500,
              })}
              placeholder="Share your thoughts about this recipe..."
              rows={4}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "4px",
                border: "1px solid #e5e7eb",
                fontSize: "14px",
                fontFamily: "inherit",
                resize: "none",
              }}
            />
            {errors.content && (
              <Text variant="caption-1" color="critical">
                {errors.content.message}
              </Text>
            )}
          </View>

          <View direction="row" gap={2} justify="end">
            <Button variant="ghost" onClick={closeModal} type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="solid"
              color="primary"
              disabled={submitting}
              rounded={true}
            >
              {submitting ? "Posting..." : "Post"}
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
            <View
              key={comment.id}
              direction="column"
              gap={2}
              paddingInline={16}
            >
              <View direction="row" justify="space-between" align="center">
                <Text variant="body-2" weight="medium">
                  {comment.author && comment.author !== 'null null' && comment.author.trim() && !comment.author.includes('@')
                    ? comment.author
                    : `Superfoodie #${comment.id?.slice(-4).toUpperCase() || '0000'}`}
                </Text>
                <Text variant="caption-1" color="neutral-faded">
                  {formatDate(comment.createdAt)}
                </Text>
              </View>
              <Text
                variant="body-2"
                attributes={{
                  style: {
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                  },
                }}
              >
                {comment.content}
              </Text>
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
    <View direction="column" gap={6}>
      <Skeleton height="1.5rem" width="30%" borderRadius="small" />
      {[1, 2, 3].map((i) => (
        <View key={i} direction="column" gap={2} paddingInline={16}>
          <View direction="row" justify="space-between" align="center">
            <Skeleton height="1rem" width="20%" borderRadius="small" />
            <Skeleton height="0.75rem" width="15%" borderRadius="small" />
          </View>
          <Skeleton height="0.875rem" width="80%" borderRadius="small" />
          <Skeleton height="0.875rem" width="60%" borderRadius="small" />
          <Divider />
        </View>
      ))}
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
