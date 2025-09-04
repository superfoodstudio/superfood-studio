'use client';

import { Suspense, useState, useEffect } from 'react';
import { View, Text, Grid, Select, Button } from 'reshaped';
import { useLazyLoadQuery, usePaginationFragment, graphql } from 'react-relay';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { LoadMore } from '@/components/ui/LoadMore';
import type { RecipeQueriesRecipeListQuery } from '@/__generated__/RecipeQueriesRecipeListQuery.graphql';
import type { AllRecipesSectionPaginationFragment$key } from '@/__generated__/AllRecipesSectionPaginationFragment.graphql';

const recipeCategoriesQuery = graphql`
  query AllRecipesSectionCategoriesQuery {
    recipeCategories
  }
`;

const sortOptions = [
  { value: 'newest', label: 'newest to oldest' },
  { value: 'oldest', label: 'oldest to newest' },
  { value: 'a-z', label: 'a to z' },
  { value: 'z-a', label: 'z to a' }
];

interface CategoryOption {
  value: string;
  label: string;
}

interface RecipeFiltersProps {
  selectedCategory: string;
  selectedSort: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  categories: CategoryOption[];
}

function RecipeFilters({ selectedCategory, selectedSort, onCategoryChange, onSortChange, categories }: RecipeFiltersProps) {
  return (
    <View direction="column" gap={4} padding={4}>
      <View direction="column" gap={3}>
        <Text variant="title-4" weight="medium">category</Text>
        <View direction="column" gap={2}>
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? 'solid' : 'ghost'}
              size="small"
              fullWidth
              onClick={() => onCategoryChange(category.value)}
              attributes={{
                style: {
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  fontWeight: selectedCategory === category.value ? '600' : '400'
                }
              }}
            >
              {category.label}
            </Button>
          ))}
        </View>
      </View>

      <View direction="column" gap={3}>
        <Text variant="title-4" weight="medium">sort</Text>
        <View direction="column" gap={2}>
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedSort === option.value ? 'solid' : 'ghost'}
              size="small"
              fullWidth
              onClick={() => onSortChange(option.value)}
              attributes={{
                style: {
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  fontWeight: selectedSort === option.value ? '600' : '400'
                }
              }}
            >
              {option.label}
            </Button>
          ))}
        </View>
      </View>

      <Button variant="outline" size="small" fullWidth>
        SAVE
      </Button>
    </View>
  );
}

const allRecipesSectionQuery = graphql`
  query AllRecipesSectionQuery($category: String, $first: Int!, $after: String) {
    ...AllRecipesSectionPaginationFragment
  }
`;

const allRecipesSectionPaginationFragment = graphql`
  fragment AllRecipesSectionPaginationFragment on Query
  @refetchable(queryName: "AllRecipesSectionPaginationQuery") {
    publicRecipes(category: $category, first: $first, after: $after)
    @connection(key: "AllRecipesSection_publicRecipes") {
      edges {
        node {
          id
          name
          slug
          description
          category
          mediaUrl
          previewImageUrl
          uploadDate
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

function RecipeGridContent({ category, sort }: { category: string; sort: string }) {
  const queryData = useLazyLoadQuery<any>(
    allRecipesSectionQuery,
    { 
      category: category || null,
      first: 12
    }
  );

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
    allRecipesSectionPaginationFragment, 
    queryData
  );
  
  if (!data.publicRecipes || data.publicRecipes.edges.length === 0) {
    return (
      <View padding={4}>
        <Text align="center">No recipes found</Text>
      </View>
    );
  }
  
  // Sort recipes if needed (since GraphQL might not handle all sort options)
  let sortedRecipes = data.publicRecipes.edges.map((edge: any) => edge.node).filter(Boolean);
  
  switch (sort) {
    case 'a-z':
      sortedRecipes.sort((a: any, b: any) => a.name.localeCompare(b.name));
      break;
    case 'z-a':
      sortedRecipes.sort((a: any, b: any) => b.name.localeCompare(a.name));
      break;
    case 'oldest':
      sortedRecipes.sort((a: any, b: any) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
      break;
    case 'newest':
    default:
      sortedRecipes.sort((a: any, b: any) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      break;
  }

  const handleLoadMore = () => {
    loadNext(12);
  };
  
  return (
    <View direction="column" gap={4}>
      <Grid columns={{ s: 1, m: 2, l: 3 }} gap={4}>
        {sortedRecipes.map((recipe: any) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </Grid>
      <LoadMore
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
        onLoadMore={handleLoadMore}
      />
    </View>
  );
}

function RecipeGridSkeleton() {
  return (
    <Grid columns={{ s: 1, m: 2, l: 3 }} gap={4}>
      {Array.from({ length: 9 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Grid>
  );
}

export function AllRecipesSection() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Load categories using GraphQL
  const categoriesData = useLazyLoadQuery<any>(recipeCategoriesQuery, {});
  
  const categories = [
    { value: '', label: 'all' },
    ...(categoriesData?.recipeCategories || []).map((cat: string) => ({
      value: cat,
      label: cat.toLowerCase()
    }))
  ];

  return (
    <View direction="column" gap={4}>
      {/* Section Title */}
      <View
        attributes={{
          style: { paddingLeft: '1rem', paddingRight: '1rem' }
        }}
      >
        <Text variant="title-2" weight="medium" attributes={{ style: { fontFamily: 'var(--font-playfair)' } }}>
          ALL RECIPES
        </Text>
      </View>

      {/* Main Content Area */}
      <View direction="row" gap={6}>
        {/* Filters Sidebar */}
        <View
          attributes={{
            style: {
              flex: '0 0 200px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e5e5e5'
            }
          }}
        >
          <RecipeFilters
            selectedCategory={selectedCategory}
            selectedSort={selectedSort}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSelectedSort}
            categories={categories}
          />
        </View>

        {/* Recipe Grid */}
        <View
          direction="column"
          attributes={{
            style: { flex: 1 }
          }}
        >
          <View
            attributes={{
              style: { paddingLeft: '1rem', paddingRight: '1rem' }
            }}
          >
            <Suspense fallback={<RecipeGridSkeleton />}>
              <RecipeGridContent category={selectedCategory} sort={selectedSort} />
            </Suspense>
          </View>
        </View>
      </View>
    </View>
  );
} 