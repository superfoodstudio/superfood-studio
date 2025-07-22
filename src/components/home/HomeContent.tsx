"use client";

import { View, Text, Button, Skeleton } from "reshaped";
import Link from "next/link";
import { Suspense } from "react";
import { useLazyLoadQuery } from "react-relay";
import { SiteSettingsQuery } from "@/graphql/queries/SiteSettingsQueries";
import type { SiteSettingsQueriesQuery } from "@/__generated__/SiteSettingsQueriesQuery.graphql";

function HeroVideoSection() {
  const data = useLazyLoadQuery<SiteSettingsQueriesQuery>(
    SiteSettingsQuery,
    {},
    { fetchPolicy: 'store-or-network' }
  );

  // Fallback video URL if no admin video is set
  const defaultVideoUrl = "https://ipfs.io/ipfs/bafybeiey5bktyrja2zfxdcnnil7neqhp3ngky2jsatqgjd3uyevcjn6p2a";
  const videoUrl = data.siteSettings?.homepageVideoUrl || defaultVideoUrl;

  return (
    <View as="section">
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          width: "100%",
          maxHeight: "66vh",
          objectFit: "cover",
          borderRadius: "24px",
          display: "block",
        }}
      >
        <source
          src={videoUrl}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </View>
  );
}

function HeroVideoLoading() {
  return (
    <View as="section">
      <Skeleton
        width="100%"
        height="66vh"
        borderRadius="large"
        attributes={{
          style: {
            display: "block"
          }
        }}
      />
    </View>
  );
}

export function HomeContent() {
  return (
    <View
      as="main"
      direction="column"
      padding={4}
      paddingTop={0}
      gap={2}
    >
      {/* Hero Video Section */}
      <Suspense fallback={<HeroVideoLoading />}>
        <HeroVideoSection />
      </Suspense>

      {/* From the Founders Section */}
      <View
        as="section"
        direction="column"
        align="center"
        gap={4}
        padding={8}
        attributes={{
          style: {
            backgroundColor: "#e7dfb9",
            borderRadius: "24px",
          },
        }}
      >
        <View divided={true} gap={4}>
          <Text
            variant="featured-3"
            align="center"
            attributes={{
              style: {
                fontFamily: "var(--font-carrois-gothic)",
                letterSpacing: "1.28px",
              },
            }}
          >
            FROM THE FOUNDERS OF SOL SIPS
          </Text>
          <Text
            variant="body-1"
            align="center"
            color="neutral"
            attributes={{
              style: {
                fontFamily: "var(--font-oswald)",
                letterSpacing: "0.96px;",
              },
            }}
          >
            a plant-forward concept studio with a new collection of audio-
            <br />
            visual recipes and superfood-centric tutorials every month
          </Text>
        </View>
        <Button variant="outline">
          LEARN MORE
        </Button>
      </View>

      {/* Become a Superfoodie Section */}
      <View as="section" direction="column" align="center" gap={4} padding={8}>
        <Text variant="featured-2" align="center">
          BECOME A SUPERFOODIE
        </Text>

        <View direction="row" align="center" justify="center" gap={6}>
          <View align="center">
            <span style={{ fontSize: "24px" }}>☕</span>
          </View>
          <View align="center">
            <span style={{ fontSize: "24px" }}>🥑</span>
          </View>
          <View align="center">
            <span style={{ fontSize: "24px" }}>📝</span>
          </View>
        </View>

        <Text variant="body-1" align="center" color="neutral">
          learn the craft of building a plant-forward plate
        </Text>

        <Text variant="body-1" align="center" color="neutral">
          unlock access to weekly recipes, special offers on our small batch
          goods, quarterly master-classes with top culinary artists and member
          rates on our in person garden-to-table activations
        </Text>

        <Button variant="solid" color="primary">
          LET'S GET COOKING
        </Button>
      </View>

      {/* Newsletter Section */}
      <View as="section" direction="column" align="center" gap={4} padding={8}>
        <Text variant="body-2">subscribe</Text>
        <View direction="row" gap={2} maxWidth={400}>
          <input
            type="email"
            placeholder="email"
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #e5e7eb",
              fontFamily: "var(--font-lato)",
            }}
          />
          <Button variant="solid">STAY IN TOUCH →</Button>
        </View>
        <View direction="row" align="center" gap={2}>
          <input
            type="checkbox"
            id="subscribeConsent"
            style={{ marginRight: "8px" }}
          />
          <label
            htmlFor="subscribeConsent"
            style={{ fontSize: "0.8rem", fontFamily: "var(--font-lato)" }}
          >
            Subscribe to receive communications for exclusive offers and events
            from Superfood Studio. By subscribing, you confirm you have read and
            understood our privacy policy.
          </label>
        </View>
      </View>

      {/* Footer links */}
      <View
        as="section"
        direction="row"
        justify="space-between"
        padding={6}
        attributes={{
          style: {
            borderTop: "1px solid #e5e7eb",
          },
        }}
      >
        <View direction="column" gap={2}>
          <Text variant="caption-1">let's chat</Text>
          <Text variant="caption-1">admin@superfoodstudio.com</Text>
        </View>
        <View direction="column" gap={2} align="end">
          <Link href="/">
            <Text variant="caption-1">home</Text>
          </Link>
          <Link href="/signup">
            <Text variant="caption-1">sign up</Text>
          </Link>
          <Link href="/about-us">
            <Text variant="caption-1">about us</Text>
          </Link>
          <Link href="/faqs">
            <Text variant="caption-1">faqs</Text>
          </Link>
          <Link href="/privacy">
            <Text variant="caption-1">privacy</Text>
          </Link>
          <Link href="/terms">
            <Text variant="caption-1">t & c</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
