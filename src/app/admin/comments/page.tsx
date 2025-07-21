'use client';

import { useState, Suspense } from 'react';
import { View, Text, Button, Divider } from 'reshaped';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useLazyLoadQuery, useMutation } from 'react-relay';
import { HideCommentMutation, DeleteCommentMutation } from '@/graphql/queries/CommentQueries';
import type { CommentQueriesHideMutation } from '@/__generated__/CommentQueriesHideMutation.graphql';
import type { CommentQueriesDeleteMutation } from '@/__generated__/CommentQueriesDeleteMutation.graphql';
import { graphql } from 'relay-runtime';

const AdminCommentsQuery = graphql`
  query pageCommentsQuery {
    recipes(status: "all") {
      id
      name
      slug
      comments {
        id
        content
        author
        email
        isHidden
        createdAt
      }
    }
  }
`;

import type { pageCommentsQuery } from '@/__generated__/pageCommentsQuery.graphql';

function AdminCommentsContent() {
  const [error, setError] = useState<string | null>(null);

  const data = useLazyLoadQuery<pageCommentsQuery>(
    AdminCommentsQuery,
    {},
    { fetchPolicy: 'store-or-network' }
  );

  const [hideComment] = useMutation<CommentQueriesHideMutation>(HideCommentMutation);
  const [deleteComment] = useMutation<CommentQueriesDeleteMutation>(DeleteCommentMutation);

  const handleHideComment = (commentId: string) => {
    hideComment({
      variables: { id: commentId },
      onError: (error) => setError(error.message),
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      return;
    }

    deleteComment({
      variables: { id: commentId },
      onError: (error) => setError(error.message),
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

  // Get all comments from all recipes
  const allComments = data.recipes.flatMap(recipe => 
    recipe.comments.map(comment => ({
      ...comment,
      recipeName: recipe.name,
      recipeSlug: recipe.slug
    }))
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <View direction="column" gap={6}>
      {error && (
        <View 
          padding={3} 
          backgroundColor="critical-faded"
          attributes={{ style: { borderRadius: '4px' } }}
        >
          <Text variant="body-2" color="critical">{error}</Text>
        </View>
      )}

      <View direction="column" gap={2}>
        <Text variant="title-1">Comment Moderation</Text>
        <Text variant="body-1" color="neutral-faded">
          Manage comments across all recipes. You can hide inappropriate comments or delete them permanently.
        </Text>
      </View>

      <View direction="column" gap={4}>
        <Text variant="title-3">All Comments ({allComments.length})</Text>
        
        {allComments.length === 0 ? (
          <View padding={6} align="center">
            <Text variant="body-1" color="neutral-faded">
              No comments found across all recipes.
            </Text>
          </View>
        ) : (
          allComments.map((comment) => (
            <View 
              key={comment.id}
              padding={4}
              backgroundColor="neutral-faded"
              attributes={{ style: { borderRadius: '8px' } }}
            >
              <View direction="column" gap={3}>
                <View direction="row" justify="space-between" align="center">
                  <View direction="column" gap={1}>
                    <Text variant="body-2" weight="medium">{comment.author}</Text>
                    <Text variant="caption-1" color="neutral-faded">
                      On recipe: {comment.recipeName} • {formatDate(comment.createdAt)}
                    </Text>
                    {comment.email && (
                      <Text variant="caption-1" color="neutral-faded">
                        Email: {comment.email}
                      </Text>
                    )}
                  </View>
                  <View direction="row" gap={2}>
                    {comment.isHidden ? (
                      <View 
                        padding={1}
                        backgroundColor="warning-faded"
                        attributes={{ style: { borderRadius: '4px' } }}
                      >
                        <Text variant="caption-1" color="warning">Hidden</Text>
                      </View>
                    ) : (
                      <Button
                        variant="outline"
                        size="small"
                        onClick={() => handleHideComment(comment.id)}
                      >
                        Hide
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="small"
                      color="critical"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </Button>
                  </View>
                </View>
                
                <View>
                  <Text variant="body-1" color={comment.isHidden ? "neutral-faded" : "neutral"}>
                    {comment.content}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

function AdminCommentsLoading() {
  return (
    <View direction="column" gap={4}>
      <Text variant="title-1">Comment Moderation</Text>
      <View padding={4}>
        <Text>Loading comments...</Text>
      </View>
    </View>
  );
}

export default function AdminCommentsPage() {
  return (
    <AdminLayout title="Comment Moderation">
      <Suspense fallback={<AdminCommentsLoading />}>
        <AdminCommentsContent />
      </Suspense>
    </AdminLayout>
  );
}