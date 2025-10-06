"use client";

import { Suspense, useState } from "react";
import { View, Text, Grid, Select, Button } from "reshaped";
import { useLazyLoadQuery, usePaginationFragment, graphql } from "react-relay";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { RecipeCard } from "@/components/recipes/RecipeCard";
import { LoadMore } from "@/components/ui/LoadMore";
import type { RecipeQueriesRecipeListQuery } from "@/__generated__/RecipeQueriesRecipeListQuery.graphql";
import type { AllRecipesSectionPaginationFragment$key } from "@/__generated__/AllRecipesSectionPaginationFragment.graphql";

const recipeCategoriesQuery = graphql`
  query AllRecipesSectionCategoriesQuery {
    recipeCategories
  }
`;

const sortOptions = [
  { value: "newest", label: "newest to oldest" },
  { value: "oldest", label: "oldest to newest" },
  { value: "a-z", label: "a to z" },
  { value: "z-a", label: "z to a" },
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

function RecipeFilters({
  selectedCategory,
  selectedSort,
  onCategoryChange,
  onSortChange,
  categories,
}: RecipeFiltersProps) {
  return (
    <View direction="column" gap={4} padding={4}>
      <View direction="column" gap={3}>
        <Text variant="featured-2" weight="medium">
          category
        </Text>
        <View direction="column" gap={2}>
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "solid" : "ghost"}
              size="small"
              color="primary"
              fullWidth
              onClick={() => onCategoryChange(category.value)}
              attributes={{
                style: {
                  justifyContent: "flex-start",
                  textAlign: "left",
                  fontWeight:
                    selectedCategory === category.value ? "600" : "400",
                },
              }}
            >
              {category.label}
            </Button>
          ))}
        </View>
      </View>

      <View direction="column" gap={3}>
        <Text variant="featured-2" weight="medium">
          sort
        </Text>
        <View direction="column" gap={2}>
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={selectedSort === option.value ? "solid" : "ghost"}
              size="small"
              color="primary"
              fullWidth
              onClick={() => onSortChange(option.value)}
              attributes={{
                style: {
                  justifyContent: "flex-start",
                  textAlign: "left",
                  fontWeight: selectedSort === option.value ? "600" : "400",
                },
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

const allRecipesSectionQuery = graphql`
  query AllRecipesSectionQuery(
    $category: String
    $first: Int!
    $after: String
    $sort: String
  ) {
    ...AllRecipesSectionPaginationFragment
  }
`;

const allRecipesSectionPaginationFragment = graphql`
  fragment AllRecipesSectionPaginationFragment on Query
  @refetchable(queryName: "AllRecipesSectionPaginationQuery") {
    publicRecipes(
      category: $category
      first: $first
      after: $after
      sort: $sort
    ) @connection(key: "AllRecipesSection_publicRecipes") {
      edges {
        node {
          id
          name
          slug
          description
          category
          servingSize
          totalTime
          prepTime
          cookTime
          mediaUrl
          previewImageUrl
          uploadDate
          averageRating
          totalRatings
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

function RecipeGridContent({
  category,
  sort,
}: {
  category: string;
  sort: string;
}) {
  const queryData = useLazyLoadQuery<any>(allRecipesSectionQuery, {
    category: category || null,
    first: 12,
    sort: sort || "newest",
  });

  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
    allRecipesSectionPaginationFragment,
    queryData,
  );

  if (!data.publicRecipes || data.publicRecipes.edges.length === 0) {
    return (
      <View padding={4}>
        <Text align="center">No recipes found</Text>
      </View>
    );
  }

  // Recipes are already sorted by the GraphQL resolver
  const recipes = data.publicRecipes.edges
    .map((edge: any) => edge.node)
    .filter(Boolean);

  const handleLoadMore = () => {
    loadNext(12);
  };

  return (
    <View direction="column" gap={4}>
      <View direction="row" gap={4}>
        {recipes.map((recipe: any, i: number) => (
          <View.Item key={recipe.id} columns={{ s: 12, m: 4 }}>
            <RecipeCard recipe={recipe} />
          </View.Item>
        ))}
      </View>
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
    <View direction="row" gap={4}>
      {Array.from({ length: 9 }).map((_, index) => (
        <View.Item key={index} columns={{ s: 12, m: 4 }}>
          <SkeletonCard />
        </View.Item>
      ))}
    </View>
  );
}

export function AllRecipesSection() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("newest");

  // Load categories using GraphQL
  const categoriesData = useLazyLoadQuery<any>(recipeCategoriesQuery, {});

  const categories = [
    { value: "", label: "all" },
    ...(categoriesData?.recipeCategories || []).map((cat: string) => ({
      value: cat,
      label: cat.toLowerCase(),
    })),
  ];

  return (
    <View direction="column" gap={4} paddingTop={4}>
      {/* Section Title */}
      <View
        attributes={{
          style: { paddingLeft: "1rem", paddingRight: "1rem" },
        }}
      >
        <Text variant="featured-2">Recipes</Text>
      </View>

      {/* Main Content Area */}
      <View
        attributes={{
          style: {
            paddingLeft: "1rem",
            paddingRight: "1rem",
          },
        }}
      >
        <View direction="row" gap={6}>
          {/* Filters Sidebar - Sticky */}
          <View
            backgroundColor="page"
            attributes={{
              style: {
                flex: "0 0 200px",
                borderRadius: "8px",
                position: "sticky",
                top: "80px",
                alignSelf: "flex-start",
                height: "fit-content",
              },
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
              style: { flex: 1 },
            }}
          >
            <Suspense fallback={<RecipeGridSkeleton />}>
              <RecipeGridContent
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
