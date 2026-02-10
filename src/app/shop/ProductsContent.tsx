'use client';

import { Suspense, useState } from 'react';
import { View, Text, Button, Hidden } from 'reshaped';
import { useLazyLoadQuery, usePaginationFragment, graphql } from 'react-relay';
import ProductList from './ProductList';
import { SkeletonCard } from '@/components/ui/SkeletonCard';
import { Grid } from 'reshaped';
import { FeaturedProduct } from '@/components/products/FeaturedProduct';

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
        <Text variant="featured-2" weight="medium">category</Text>
        <View direction="column" gap={2}>
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? 'solid' : 'ghost'}
              size="small"
              color="primary"
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
        <Text variant="featured-2" weight="medium">sort</Text>
        <View direction="column" gap={2}>
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedSort === option.value ? 'solid' : 'ghost'}
              size="small"
              color="primary"
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

    </View>
  );
}

function AllProductsSection() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Load categories using GraphQL
  const categoriesData = useLazyLoadQuery<any>(productCategoriesQuery, {});

  const categories = [
    { value: '', label: 'all' },
    ...(categoriesData?.productCategories || []).map((cat: string) => ({
      value: cat,
      label: cat.toLowerCase()
    }))
  ];

  const activeFilterLabel = [
    selectedCategory ? categories.find(c => c.value === selectedCategory)?.label : null,
    selectedSort !== 'newest' ? sortOptions.find(s => s.value === selectedSort)?.label : null,
  ].filter(Boolean).join(', ');

  return (
    <View direction="column" gap={6}>
      {/* Featured Product */}
      <View
        attributes={{
          style: { paddingLeft: '1rem', paddingRight: '1rem' }
        }}
      >
        <FeaturedProduct />
      </View>

      {/* Main Content Area */}
      <View
        attributes={{
          style: {
            paddingLeft: '1rem',
            paddingRight: '1rem'
          }
        }}
      >
        {/* Mobile filter toggle */}
        <Hidden hide={{ s: false, m: true }}>
          <View direction="column" gap={3} paddingBottom={4}>
            <Button
              variant="outline"
              size="small"
              fullWidth
              onClick={() => setFiltersOpen(!filtersOpen)}
              attributes={{
                style: { justifyContent: 'space-between' }
              }}
            >
              <span>Filters{activeFilterLabel ? `: ${activeFilterLabel}` : ''}</span>
              <span style={{ fontSize: '12px' }}>{filtersOpen ? '▲' : '▼'}</span>
            </Button>
            {filtersOpen && (
              <View backgroundColor="page" borderRadius="medium">
                <ProductFilters
                  selectedCategory={selectedCategory}
                  selectedSort={selectedSort}
                  onCategoryChange={setSelectedCategory}
                  onSortChange={setSelectedSort}
                  categories={categories}
                />
              </View>
            )}
          </View>
        </Hidden>

        <View direction="row" gap={6}>
          {/* Filters Sidebar - Desktop only */}
          <Hidden hide={{ s: true, m: false }}>
            <View
              backgroundColor="page"
              attributes={{
                style: {
                  width: '200px',
                  borderRadius: '8px',
                  position: 'sticky',
                  top: '80px',
                  alignSelf: 'flex-start',
                  height: 'fit-content'
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
          </Hidden>

          {/* Product Grid */}
          <View
            direction="column"
            attributes={{
              style: { flex: 1 }
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
    <View direction="row" gap={4}>
      {Array.from({ length: 9 }).map((_, index) => (
        <View.Item key={index} columns={{ s: 12, m: 6 }}>
          <SkeletonCard />
        </View.Item>
      ))}
    </View>
  );
} 