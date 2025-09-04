'use client';

import { Suspense, useState } from 'react';
import { View, Text, Button } from 'reshaped';
import { useLazyLoadQuery, usePaginationFragment, graphql } from 'react-relay';
import ProductList from './ProductList';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Grid } from 'reshaped';

const productCategoriesQuery = graphql`
  query ProductsContentCategoriesQuery {
    productCategories
  }
`;

const sortOptions = [
  { value: 'newest', label: 'newest to oldest' },
  { value: 'oldest', label: 'oldest to newest' },
  { value: 'a-z', label: 'a to z' },
  { value: 'z-a', label: 'z to a' },
  { value: 'price-low-high', label: 'price low to high' },
  { value: 'price-high-low', label: 'price high to low' }
];

interface CategoryOption {
  value: string;
  label: string;
}

interface ProductFiltersProps {
  selectedCategory: string;
  selectedSort: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  categories: CategoryOption[];
}

function ProductFilters({ selectedCategory, selectedSort, onCategoryChange, onSortChange, categories }: ProductFiltersProps) {
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

function AllProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');

  // Load categories using GraphQL
  const categoriesData = useLazyLoadQuery<any>(productCategoriesQuery, {});
  
  const categories = [
    { value: '', label: 'all' },
    ...(categoriesData?.productCategories || []).map((cat: string) => ({
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
          ALL PRODUCTS
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
          <ProductFilters
            selectedCategory={selectedCategory}
            selectedSort={selectedSort}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSelectedSort}
            categories={categories}
          />
        </View>

        {/* Product Grid */}
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
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList 
                category={selectedCategory} 
                sort={selectedSort} 
              />
            </Suspense>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ProductsContent() {
  return <AllProductsSection />;
}

function ProductListSkeleton() {
  return (
    <Grid columns={{ s: 1, m: 2, l: 3, xl: 4 }} gap={4}>
      {Array.from({ length: 8 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </Grid>
  );
} 