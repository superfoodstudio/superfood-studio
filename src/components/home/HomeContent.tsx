"use client";

import { View, Text, Button, Skeleton } from "reshaped";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { QueryErrorBoundary } from "@/components/ui/QueryErrorBoundary";
import { useLazyLoadQuery } from "react-relay";
import { SiteSettingsQuery } from "@/graphql/queries/SiteSettingsQueries";
import { ipfsUrl } from "@/lib/ipfs";
import type { SiteSettingsQueriesQuery } from "@/__generated__/SiteSettingsQueriesQuery.graphql";

function HeroVideoSection() {
  const data = useLazyLoadQuery<SiteSettingsQueriesQuery>(
    SiteSettingsQuery,
    {},
    { fetchPolicy: "store-or-network" },
  );

  // Fallback video URL if no admin video is set
  const defaultVideoUrl =
    "https://ipfs.io/ipfs/bafybeiey5bktyrja2zfxdcnnil7neqhp3ngky2jsatqgjd3uyevcjn6p2a";
  const videoUrl = data.siteSettings?.homepageVideoUrl || defaultVideoUrl;

  return (
    <View as="section">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster=""
        style={{
          width: "100%",
          maxHeight: "66vh",
          objectFit: "cover",
          borderRadius: "96px",
          display: "block",
          backgroundColor: "#e0ddd8",
        }}
      >
        <source src={ipfsUrl(videoUrl)} type="video/mp4" />
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
            display: "block",
          },
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
      padding={{ s: 4, m: 0 }}
      paddingTop={0}
      gap={2}
      width="100%"
      attributes={{
        style: {
          maxWidth: "1280px",
          margin: "0 auto",
        },
      }}
    >
      {/* Hero Video Section */}
      <View padding={{ s: 0, m: 4 }}>
        <QueryErrorBoundary>
          <Suspense fallback={<HeroVideoLoading />}>
            <HeroVideoSection />
          </Suspense>
        </QueryErrorBoundary>
      </View>

      {/* Your Culinary Playhouse Section */}
      <View padding={{ s: 0, m: 4 }}>
        <View
          as="section"
          padding={8}
          attributes={{
            style: {
              backgroundColor: "var(--rs-color-lime-green)",
              borderRadius: "24px",
            },
          }}
        >
          <View direction="column" align="center" paddingBlock={8} gap={6}>
            {/* Title */}
            <View direction="column" align="center" gap={0}>
              <Text
                variant="title-4"
                attributes={{
                  style: {
                    fontFamily: "var(--font-midruns-sans)",
                    color: "var(--rs-color-forest-green)",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    marginBottom: "-10px",
                  },
                }}
              >
                YOUR
              </Text>
              <Text
                variant="title-1"
                attributes={{
                  style: {
                    fontFamily: "var(--font-midruns-script)",
                    color: "var(--rs-color-forest-green)",
                    marginBottom: "-8px",
                  },
                }}
              >
                Culinary
              </Text>
              <Text
                variant="title-4"
                attributes={{
                  style: {
                    fontFamily: "var(--font-midruns-sans)",
                    color: "var(--rs-color-forest-green)",
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                  },
                }}
              >
                PLAYHOUSE
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Become a Superfoodie Section */}
      <View padding={{ s: 0, m: 4 }}>
        <View
          as="section"
          padding={8}
          attributes={{
            style: {
              backgroundColor: "var(--rs-color-beige)",
              borderRadius: "24px",
            },
          }}
        >
          <View direction={{ s: "column", m: "row" }} gap={20} align="stretch">
            {/* Left Section - Text Content */}
            <View
              direction="column"
              gap={4}
              paddingInline={24}
              attributes={{
                style: {
                  flex: 1,
                },
              }}
            >
              <Text
                variant="title-4"
                attributes={{
                  style: {
                    fontFamily: "Habibi, serif",
                  },
                }}
              >
                Become a<br />
                Superfoodie
              </Text>
              <View gap={4}>
                <Text variant="body-1" color="neutral">
                  Learn the craft of building a plant-forward plate.
                </Text>
                <Text variant="body-1" color="neutral">
                  Unlock access to weekly recipes, special offers on our small
                  batch goods, quarterly master-classes with top culinary
                  artists and member rates on our in person garden-to-table
                  activations.
                </Text>
              </View>
              <Button
                size="xlarge"
                variant="solid"
                attributes={{ color: "var(--rs-color-sky-blue)" }}
              >
                Join
              </Button>
            </View>

            {/* Right Section - Blue Rounded Box */}
            <View
              padding={8}
              align="center"
              justify="center"
              borderRadius="large"
              attributes={{
                style: {
                  flex: 1,
                  backgroundColor: "var(--rs-color-sky-blue)",
                  minHeight: "320px",
                },
              }}
            >
              <Image
                src="/superfood-studio-2015.png"
                alt="Superfood Studio logo"
                width={400}
                height={300}
                style={{ maxWidth: "80%", height: "auto" }}
              />
            </View>
          </View>
        </View>
      </View>

      {/* From the Founders Section */}
      <View padding={{ s: 0, m: 4 }}>
        <View
          as="section"
          direction="column"
          align="center"
          gap={6}
          padding={12}
          attributes={{
            style: {
              backgroundColor: "var(--rs-color-coral-red)",
              borderRadius: "24px",
            },
          }}
        >
          <View direction="column" align="center" gap={1}>
            <Text
              variant="featured-2"
              align="center"
              attributes={{
                style: {
                  fontFamily: "var(--font-midruns-sans)",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "var(--rs-color-background-page)",
                },
              }}
            >
              From the founders of
            </Text>
            <Text
              variant="title-1"
              align="center"
              attributes={{
                style: {
                  fontFamily: "var(--font-midruns-script)",
                  color: "var(--rs-color-background-page)",
                },
              }}
            >
              Sol Sips
            </Text>
          </View>
          <View
            paddingInline={{ s: 12, m: 48 }}
            attributes={{ style: { marginTop: "-12px" } }}
          >
            <Text
              variant="featured-3"
              align="center"
              attributes={{
                style: {
                  color: "var(--rs-color-background-page)",
                },
              }}
            >
              A plant-forward concept studio with a new collection of
              audio-visual recipes and superfood-centric tutorials every month
            </Text>
          </View>
        </View>
      </View>

      {/* Newsletter Section */}
      <View padding={{ s: 0, m: 4 }} gap={8}>
        <View
          as="section"
          direction={{ s: "column", m: "row" }}
          align="center"
          justify="center"
          gap={16}
          padding={12}
          attributes={{
            style: {
              backgroundColor: "var(--rs-color-forest-green)",
              borderRadius: "24px",
            },
          }}
        >
          <Text
            variant="title-3"
            attributes={{
              style: {
                fontFamily: "Habibi, serif",
                color: "var(--rs-color-background-page)",
              },
            }}
          >
            Subscribe!
          </Text>
          <View direction="column" gap={4} maxWidth="500px" paddingInline={8}>
            <View direction="column" gap={4}>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                style={{
                  padding: "16px 24px",
                  borderRadius: "48px",
                  border: "none",
                  backgroundColor: "var(--rs-color-background-page)",
                  fontFamily: "var(--font-nunito)",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              />
              <Button
                variant="solid"
                size="large"
                attributes={{
                  style: {
                    backgroundColor: "var(--rs-color-lime-green)",
                    color: "var(--rs-color-forest-green)",
                    borderRadius: "48px",
                    fontFamily: "var(--font-midruns-sans)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  },
                }}
              >
                Sign Up
              </Button>
            </View>
            <Text
              variant="body-3"
              align="center"
              attributes={{
                style: {
                  color: "var(--rs-color-lime-green)",
                },
              }}
            >
              Subscribe to receive communications for exclusive offers and events
              from Superfood Studio. By subscribing, you confirm you have read and
              understood our privacy policy.
            </Text>
          </View>
        </View>
      </View>

      {/* Footer links */}
      <View padding={{ s: 0, m: 4 }}>
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
    </View>
  );
}
