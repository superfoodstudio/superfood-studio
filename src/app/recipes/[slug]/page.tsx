"use client";

import { Suspense, useState } from "react";
import { View, Text, Button, Divider } from "reshaped";
import { useLazyLoadQuery, useFragment } from "react-relay";
import {
  RecipeDetailBySlugQuery,
  RecipeDetailFragment,
} from "@/graphql/queries/RecipeQueries";
import type { RecipeQueriesRecipeDetailBySlugQuery } from "@/__generated__/RecipeQueriesRecipeDetailBySlugQuery.graphql";
import type {
  RecipeQueriesRecipeDetail_recipe$key,
  RecipeQueriesRecipeDetail_recipe$data,
} from "@/__generated__/RecipeQueriesRecipeDetail_recipe.graphql";
import { useEffect } from "react";
import { AppContainer } from "@/components/layout/AppContainer";
import { useParams, useRouter } from "next/navigation";
import { MediaDisplay } from "@/components/recipes/MediaDisplay";
import { RecipeComments } from "@/components/recipes/RecipeComments";
import { StarRating } from "@/components/ratings/StarRating";
import { RecipeDetailSkeleton } from "@/components/ui/RecipeDetailSkeleton";
import { RichTextDisplay } from "@/components/ui/RichTextDisplay";
import styles from "./RecipeDetail.module.css";

// LazyLoad component that will only fetch data when it's needed
function RecipeDetailLazy({ slug }: { slug: string }) {
  const data = useLazyLoadQuery<RecipeQueriesRecipeDetailBySlugQuery>(
    RecipeDetailBySlugQuery,
    { slug },
    { fetchPolicy: "store-or-network" }, // Use cache if available, otherwise fetch
  );

  if (data.recipeBySlug) {
    return <RecipeDetailView recipeRef={data.recipeBySlug} />;
  }

  return <RecipeNotFound />;
}

// Force dynamic rendering to avoid static generation issues on Vercel
export const dynamic = "force-dynamic";

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeSlug = params.slug as string;
  const [isReady, setIsReady] = useState(false);

  // Delay query execution until component is mounted
  useEffect(() => {
    setIsReady(true);
  }, []);

  return (
    <AppContainer maxWidth={1000}>
      <Suspense fallback={<RecipeDetailSkeleton />}>
        {isReady && <RecipeDetailLazy slug={recipeSlug} />}
      </Suspense>
    </AppContainer>
  );
}

function RecipeNotFound() {
  const router = useRouter();
  return (
    <View direction="column" align="center" gap={4} padding={8}>
      <Text variant="title-5">Recipe not found</Text>
      <Button variant="solid" onClick={() => router.push("/recipes")}>
        Back to Recipes
      </Button>
    </View>
  );
}

type RecipeDetailViewProps = {
  recipeRef: RecipeQueriesRecipeDetail_recipe$key;
};

// This component always receives a valid recipe reference
function RecipeDetailView({ recipeRef }: RecipeDetailViewProps) {
  const router = useRouter();

  // Use the fragment to access recipe data with type safety
  const recipe: RecipeQueriesRecipeDetail_recipe$data = useFragment(
    RecipeDetailFragment,
    recipeRef,
  );

  // Format date
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View direction="column" gap={6}>
      <Button
        variant="ghost"
        onClick={() => router.back()}
        attributes={{ style: { alignSelf: "flex-start" } }}
      >
        ← Back
      </Button>

      <View direction="column" gap={4}>
        {/* Published Date */}
        <View align="end">
          <Text variant="caption-1" color="neutral-faded">
            Published on {formatDate(recipe.uploadDate)}
          </Text>
        </View>

        {/* Recipe Media */}
        <MediaDisplay
          mediaUrl={recipe.mediaUrl}
          altText={recipe.name}
          style={{
            width: "100%",
            height: "400px",
          }}
        />

        {/* Category Tag */}
        <View
          attributes={{
            style: {
              display: "inline-block",
              border: "1px solid var(--rs-color-border-neutral-faded)",
              alignSelf: "flex-start",
              borderRadius: "4px",
              padding: "4px 8px",
            },
          }}
        >
          <Text variant="caption-1">
            {recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)}
          </Text>
        </View>

        {/* Recipe Title and Rating */}
        <View
          direction={{ s: "column", m: "row" }}
          gap={6}
          align={{ s: "start", m: "center" }}
          justify="space-between"
        >
          <Text
            variant="title-5"
            attributes={{ style: { flex: 1, marginRight: "16px" } }}
          >
            {recipe.name}
          </Text>

          {/* Rating Section */}
          <View attributes={{ style: { flexShrink: 0 } }}>
            <StarRating
              itemId={recipe.id}
              itemType="recipe"
              averageRating={recipe.averageRating || 0}
              totalRatings={recipe.totalRatings}
              size="large"
            />
          </View>
        </View>

        {/* Recipe Info Section */}
        {(recipe.servingSize ||
          recipe.totalTime ||
          recipe.prepTime ||
          recipe.cookTime) && (
          <View direction="row" gap={6} wrap>
            {recipe.servingSize && (
              <View direction="column" gap={1}>
                <Text variant="caption-1" weight="medium" color="neutral-faded">
                  SERVES
                </Text>
                <Text variant="body-2">{recipe.servingSize}</Text>
              </View>
            )}
            {recipe.totalTime && (
              <View direction="column" gap={1}>
                <Text variant="caption-1" weight="medium" color="neutral-faded">
                  TOTAL TIME
                </Text>
                <Text variant="body-2">{recipe.totalTime} min</Text>
              </View>
            )}
            {recipe.prepTime && (
              <View direction="column" gap={1}>
                <Text variant="caption-1" weight="medium" color="neutral-faded">
                  PREP TIME
                </Text>
                <Text variant="body-2">{recipe.prepTime} min</Text>
              </View>
            )}
            {recipe.cookTime && (
              <View direction="column" gap={1}>
                <Text variant="caption-1" weight="medium" color="neutral-faded">
                  COOK TIME
                </Text>
                <Text variant="body-2">{recipe.cookTime} min</Text>
              </View>
            )}
          </View>
        )}

        {/* Recipe Description */}
        <View paddingInline={{ s: 0, m: 16 }} paddingBlock={{ s: 2, m: 8 }}>
          <Text
            variant="body-1"
            attributes={{ style: { fontFamily: "Habibi, serif" } }}
          >
            <RichTextDisplay content={recipe.description} />
          </Text>
        </View>

        <Divider />

        {/* Ingredients and Instructions */}
        <View direction={{ s: "column", m: "row" }} gap={6} align="start">
          {/* Ingredients - Sticky on left */}
          <View
            padding={{ s: 2, m: 6 }}
            attributes={{
              className: styles.ingredientsSticky,
            }}
          >
            <View direction="column" gap={6}>
              <Text variant="featured-2">Ingredients</Text>
              <Text
                variant="body-1"
                attributes={{ style: { fontFamily: "Habibi, serif" } }}
              >
                <RichTextDisplay content={recipe.ingredients || ""} />
              </Text>
            </View>
          </View>

          {/* Instructions - Scrollable on right */}
          <View padding={{ s: 2, m: 6 }} grow>
            <View direction="column" gap={6}>
              <Text variant="featured-2">Instructions</Text>
              <Text
                variant="body-1"
                attributes={{ style: { fontFamily: "Habibi, serif" } }}
              >
                <RichTextDisplay content={recipe.instructions || ""} />
              </Text>
            </View>
          </View>
        </View>

        <Divider />

        {/* Comments Section */}
        <View padding={{ s: 2, m: 8 }}>
          <RecipeComments recipeId={recipe.id} />
        </View>
      </View>
    </View>
  );
}
