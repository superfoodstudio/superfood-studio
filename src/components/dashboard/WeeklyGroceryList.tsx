'use client';

import { Suspense } from 'react';
import { View, Text, Button, Modal, useToggle, Skeleton } from 'reshaped';
import { useLazyLoadQuery } from 'react-relay';
import { SiteSettingsQuery } from '@/graphql/queries/SiteSettingsQueries';
import { RichTextDisplay } from '@/components/ui/RichTextDisplay';
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
        size="large"
        color="primary"
        rounded={true}
        onClick={() => groceryModal.activate()}
      >
        Get Grocery List
      </Button>

      <Modal
        active={groceryModal.active}
        onClose={groceryModal.deactivate}
        position="bottom"
      >
        <View padding={6} gap={4}>
            {/* Handle bar for visual indication it's a bottom sheet */}
            <View 
              align="center"
              paddingBottom={2}
            >
              <View
                attributes={{
                  style: {
                    width: '40px',
                    height: '4px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '2px'
                  }
                }}
              />
            </View>

            <Text
              variant="title-3"
              align="center"
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
                  maxHeight: '50vh',
                  overflowY: 'auto',
                  padding: '16px',
                  backgroundColor: '#f7fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }
              }}
            >
              <RichTextDisplay 
                content={groceryListContent} 
                className="grocery-list-content"
              />
            </View>

            <View direction="row" justify="center" paddingTop={2}>
              <Button
                variant="outline"
                size="large"
                onClick={groceryModal.deactivate}
                attributes={{
                  style: {
                    borderRadius: '25px',
                    paddingLeft: '24px',
                    paddingRight: '24px'
                  }
                }}
              >
                Close
              </Button>
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
