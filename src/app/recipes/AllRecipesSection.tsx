'use client';

import { Suspense, useState } from 'react';
import { View, Text, Grid, Select, Button } from 'reshaped';
import { useLazyLoadQuery } from 'react-relay';
import { RecipeListQuery } from '@/graphql/queries/RecipeQueries';
import type { RecipeQueriesRecipeListQuery } from '@/__generated__/RecipeQueriesRecipeListQuery.graphql';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { RecipeCard } from '@/components/recipes/RecipeCard';

const categories = [
  { value: '', label: 'all' },
  { value: 'breakfast', label: 'breakfast' },
  { value: 'lunch', label: 'lunch' },
  { value: 'dinner', label: 'dinner' },
  { value: 'snacks', label: 'snacks' },
  { value: 'wellness', label: 'wellness' }
];

const sortOptions = [
  { value: 'newest', label: 'newest to oldest' },
  { value: 'oldest', label: 'oldest to newest' },
  { value: 'a-z', label: 'a to z' },
  { value: 'z-a', label: 'z to a' }
];

interface RecipeFiltersProps {
  selectedCategory: string;
  selectedSort: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
}

function RecipeFilters({ selectedCategory, selectedSort, onCategoryChange, onSortChange }: RecipeFiltersProps) {
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

function RecipeGridContent({ category, sort }: { category: string; sort: string }) {
  const data = useLazyLoadQuery<RecipeQueriesRecipeListQuery>(
    RecipeListQuery,
    { 
      category: category || null,
      first: 15,
      after: null
    }
  );
  
  if (!data.publicRecipes || data.publicRecipes.edges.length === 0) {
    return (
      <View padding={4}>
        <Text align="center">No recipes found</Text>
      </View>
    );
  }
  
  // Sort recipes if needed (since GraphQL might not handle all sort options)
  let sortedRecipes = data.publicRecipes.edges.map(edge => edge.node).filter(Boolean);
  
  switch (sort) {
    case 'a-z':
      sortedRecipes.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'z-a':
      sortedRecipes.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'oldest':
      sortedRecipes.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
      break;
    case 'newest':
    default:
      sortedRecipes.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
      break;
  }
  
  return (
    <Grid columns={{ s: 1, m: 2, l: 3 }} gap={4}>
      {sortedRecipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </Grid>
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