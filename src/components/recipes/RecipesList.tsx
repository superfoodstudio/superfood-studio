'use client';

import React, { Suspense } from 'react';
import { graphql, useLazyLoadQuery } from 'react-relay';
import { RecipeCard } from './RecipeCard';
import { View, Text } from 'reshaped';
import { RecipesListQuery } from '@/__generated__/RecipesListQuery.graphql';

const recipesListQuery = graphql`
  query RecipesListQuery($category: String) {
    publicRecipes(category: $category) {
      id
      ...RecipeCardFragment
    }
  }
`;

interface RecipesListProps {
  category?: string;
}

function RecipesListContent({ category }: RecipesListProps) {
  const data = useLazyLoadQuery<RecipesListQuery>(
    recipesListQuery,
    { category }
  );

  if (!data.publicRecipes || data.publicRecipes.length === 0) {
    return (
      <View padding={4}>
        <Text>No recipes found</Text>
      </View>
    );
  }

  return (
    <View direction="column" gap={4}>
      <Text variant="title-2">Recipes</Text>
      <View 
        direction={{ s: 'column', m: 'row' }} 
        gap={3}
        wrap
      >
        {data.publicRecipes.map((recipe, index) => (
          <div 
            key={index} 
            style={{ 
              flex: '1 1 auto', 
              minWidth: '300px', 
              maxWidth: '450px', 
              margin: '8px' 
            }}
          >
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </View>
    </View>
  );
}

// Loading fallback component
function RecipesListFallback() {
  return (
    <View height="200px" align="center" justify="center">
      <div className="loading-spinner" style={{
        width: '40px',
        height: '40px',
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderRadius: '50%',
        borderTopColor: '#2E1A47',
        animation: 'spin 1s linear infinite'
      }} />
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </View>
  );
}

// Error boundary fallback
function RecipesListError({ message }: { message: string }) {
  return (
    <View 
      padding={4} 
      attributes={{
        style: {
          backgroundColor: '#fdeded',
          borderRadius: '8px'
        }
      }}
    >
      <Text color="critical">Error loading recipes: {message}</Text>
    </View>
  );
}

export function RecipesList(props: RecipesListProps) {
  return (
    <Suspense fallback={<RecipesListFallback />}>
      <RecipesListContent {...props} />
    </Suspense>
  );
} 