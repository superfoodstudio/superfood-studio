'use client';

import { Suspense, useState, useEffect } from 'react';
import { View, Text, Button, Modal, useToggle, Skeleton } from 'reshaped';
import { useLazyLoadQuery } from 'react-relay';
import { SiteSettingsQuery } from '@/graphql/queries/SiteSettingsQueries';
import { RichTextDisplay } from '@/components/ui/RichTextDisplay';
import type { SiteSettingsQueriesQuery } from '@/__generated__/SiteSettingsQueriesQuery.graphql';

function WeeklyGroceryListContent() {
  const groceryModal = useToggle();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 660);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

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
        fullWidth={{ s: true, m: false }}
        onClick={() => groceryModal.activate()}
        attributes={{
          style: {
            fontWeight: 300,
            textTransform: "uppercase",
            fontFamily: "var(--font-midruns-sans)",
            letterSpacing: "1.2px",
            minWidth: '150px'
          },
        }}
      >
        Grocery List
      </Button>

      <Modal
        active={groceryModal.active}
        onClose={groceryModal.deactivate}
        position={isMobile ? "bottom" : "center"}
        size="500px"
        attributes={{ style: { border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' } }}
      >
        <View padding={6} gap={4} attributes={{ style: { backgroundColor: 'var(--rs-color-cream)', borderRadius: '12px' } }}>
            <Text
              variant="featured-2"
              align="center"
              weight="medium"
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
