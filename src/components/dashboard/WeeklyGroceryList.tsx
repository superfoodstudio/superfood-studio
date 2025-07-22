'use client';

import { Suspense } from 'react';
import { View, Text, Button, Modal, useToggle, Skeleton } from 'reshaped';
import { useLazyLoadQuery } from 'react-relay';
import { SiteSettingsQuery } from '@/graphql/queries/SiteSettingsQueries';
import type { SiteSettingsQueriesQuery } from '@/__generated__/SiteSettingsQueriesQuery.graphql';

function WeeklyGroceryListContent() {
  const groceryModal = useToggle();

  const data = useLazyLoadQuery<SiteSettingsQueriesQuery>(
    SiteSettingsQuery,
    {},
    { fetchPolicy: 'store-or-network' }
  );

  const groceryListContent = data.siteSettings?.weeklyGroceryList;

  if (!groceryListContent?.trim()) {
    return null;
  }

  return (
    <>
      <Button
        variant="solid"
        onClick={() => groceryModal.activate()}
        attributes={{
          style: {
            backgroundColor: '#6b4c7a',
            borderRadius: '8px',
            fontWeight: '600',
            letterSpacing: '0.5px'
          }
        }}
      >
        View Weekly Grocery List
      </Button>

      <Modal
        active={groceryModal.active}
        onClose={groceryModal.deactivate}
        size="medium"
      >
        <View padding={6}>
          <View gap={4}>
            <Text
              variant="title-3"
              attributes={{
                style: {
                  fontFamily: 'var(--font-big-caslon)',
                  color: '#2d3748'
                }
              }}
            >
              Weekly Grocery List
            </Text>

            <View
              attributes={{
                style: {
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#4a5568',
                  maxHeight: '60vh',
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap'
                }
              }}
            >
              {groceryListContent}
            </View>

            <View direction="row" justify="end" paddingTop={4}>
              <Button
                variant="ghost"
                onClick={groceryModal.deactivate}
              >
                Close
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function WeeklyGroceryListLoading() {
  return (
    <Skeleton
      height="2.75rem"
      width="12rem"
      borderRadius="small"
    />
  );
}

export function WeeklyGroceryList() {
  return (
    <Suspense fallback={<WeeklyGroceryListLoading />}>
      <WeeklyGroceryListContent />
    </Suspense>
  );
}
