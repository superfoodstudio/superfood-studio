"use client";

import { Suspense, useRef, useState } from "react";
import { QueryErrorBoundary } from '@/components/ui/QueryErrorBoundary';
import { View, Text, Card, Button, Skeleton } from "reshaped";
import { useLazyLoadQuery } from "react-relay";
import Link from "next/link";
import Image from "next/image";
import { FeaturedRecipeQuery } from "@/graphql/queries/FeaturedRecipeQuery";
import { stripHtml } from "@/lib/textUtils";
import { StarRating } from "@/components/ratings/StarRating";
import { ipfsUrl } from "@/lib/ipfs";
import type { FeaturedRecipeQueryQuery } from "@/__generated__/FeaturedRecipeQueryQuery.graphql";

function FeaturedRecipeContent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const data = useLazyLoadQuery<FeaturedRecipeQueryQuery>(
    FeaturedRecipeQuery,
    {},
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.muted = true;
    }
  };

  // Get the featured recipe
  const recipe = data.featuredRecipe;

  if (!recipe) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Link href={`/recipes/${recipe.slug}`} style={{ textDecoration: "none", display: "block" }}>
    <Card
      padding={{ s: 0, m: 4 }}
      attributes={{
        style: {
          border: "1px solid #e5e5e5",
          borderRadius: "12px",
          overflow: "hidden",
          cursor: "pointer",
        },
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
      }}
    >
      <View
        direction={{ s: "column", m: "row" }}
        height={{ s: "auto", m: "320px" }}
      >

        {/* Recipe - Left Side */}
        <View
          width={{ s: "100%", m: "50%" }}
          height="320px"
          borderRadius="medium"
          overflow="hidden"
          attributes={{
            style: {
              position: "relative",
            },
          }}
        >
          {recipe.mediaUrl && recipe.mediaUrl.includes(".mp4") ? (
            <>
              <video
                ref={videoRef}
                src={ipfsUrl(recipe.mediaUrl)}
                style={{
                  width: "100%",
                  height: "320px",
                  objectFit: "cover",
                  objectPosition: "center center",
                  display: isHovered ? "block" : "none",
                }}
                muted
                loop
              />
              <div style={{ position: 'relative', width: '100%', height: '320px', display: isHovered ? 'none' : 'block' }}>
                <Image
                  src={ipfsUrl(recipe.previewImageUrl || recipe.mediaUrl)}
                  alt={recipe.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "cover", objectPosition: "center center" }}
                />
              </div>
            </>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '320px' }}>
              <Image
                src={ipfsUrl(recipe.previewImageUrl || recipe.mediaUrl)}
                alt={recipe.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "center center" }}
              />
            </div>
          )}
        </View>

        {/* Recipe Content - Right Side */}
        <View
          direction="column"
          gap={4}
          padding={{ s: 4, m: 8 }}
          attributes={{
            style: {
              flex: 1,
              justifyContent: "center",
            },
          }}
        >
          <Text
            variant="caption-1"
            color="critical"
            weight="bold"
            attributes={{
              style: {
                textTransform: "uppercase",
                letterSpacing: "1px",
              },
            }}
          >
            RECIPE OF THE DAY
          </Text>

          <Text
            variant="featured-1"
            maxLines={2}
            attributes={{
              style: {
                lineHeight: "1.2",
                fontWeight: "400",
              },
            }}
          >
            {recipe.name}
          </Text>

          <Text variant="body-2" color="neutral" maxLines={3}>
            {stripHtml(recipe.description, 200)}
          </Text>

          <StarRating
            itemId={recipe.id}
            itemType="recipe"
            averageRating={recipe.averageRating || 0}
            totalRatings={recipe.totalRatings || 0}
            size="small"
            readonly={true}
          />

          <Text variant="caption-1" color="neutral-faded">
            {recipe.totalTime
              ? `${recipe.totalTime} minutes`
              : recipe.cookTime
                ? `${recipe.cookTime} minutes`
                : recipe.prepTime
                  ? `${recipe.prepTime} minutes`
                  : "Time varies"}
          </Text>
        </View>
      </View>
    </Card>
    </Link>
  );
}

function FeaturedRecipeLoading() {
  return (
    <Card
      padding={0}
      attributes={{
        style: {
          border: "1px solid #e5e5e5",
          borderRadius: "12px",
        },
      }}
    >
      <View direction="row" height="400px">
        {/* Image/Video skeleton - Left Side */}
        <View attributes={{ style: { flex: "0 0 50%" } }}>
          <Skeleton height="100%" width="100%" />
        </View>

        {/* Content skeleton - Right Side */}
        <View
          padding={8}
          direction="column"
          gap={4}
          attributes={{ style: { flex: 1 } }}
        >
          <Skeleton height="1rem" width="8rem" />
          <Skeleton height="3rem" width="90%" />
          <Skeleton height="1rem" width="6rem" />
          <Skeleton height="1rem" width="100%" />
          <Skeleton height="1rem" width="80%" />
          <Skeleton height="1rem" width="60%" />
          <View direction="row" gap={2} align="center">
            <Skeleton height="1rem" width="5rem" />
            <Skeleton height="1rem" width="2rem" />
          </View>
          <Skeleton height="1rem" width="7rem" />
        </View>
      </View>
    </Card>
  );
}

export function FeaturedRecipe() {
  return (
    <QueryErrorBoundary>
      <Suspense fallback={<FeaturedRecipeLoading />}>
        <FeaturedRecipeContent />
      </Suspense>
    </QueryErrorBoundary>
  );
}
