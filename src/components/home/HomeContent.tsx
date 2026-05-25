"use client";

import { View, Text, Button, Skeleton, Modal, useToggle } from "reshaped";
import Link from "next/link";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
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
          height: "66vh",
          objectFit: "cover",
          borderRadius: "96px",
          display: "block",
          backgroundColor: "var(--rs-color-cream)",
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
  const { login, authenticated } = usePrivy();
  const joinModal = useToggle();

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
                  Superfood Studio is an online platform grounded in the art of culinary storytelling. We are a membership-based culinary playhouse featuring plant-forward recipes for eating, as well as beauty and self-care rituals.
                </Text>
                <Text variant="body-1" color="neutral">
                  We feature contributions from chefs, food creatives, critics, nutritionists, wellness practitioners, farmers, gardeners, and food justice organizers sharing their distinct perspectives on food.
                </Text>
              </View>
              <Button
                size="xlarge"
                variant="solid"
                onClick={() => joinModal.activate()}
                attributes={{
                  style: {
                    backgroundColor: 'var(--rs-color-lavender)',
                    color: '#fff',
                  }
                }}
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
                Subscribe
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

      {/* Join Modal */}
      <Modal
        active={joinModal.active}
        onClose={joinModal.deactivate}
        position="center"
        size="600px"
        attributes={{ style: { border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' } }}
      >
        <View padding={10} gap={6} attributes={{ style: { backgroundColor: 'var(--rs-color-cream)', borderRadius: '12px' } }}>
          <Text
            variant="featured-2"
            weight="bold"
            align="center"
            attributes={{ style: { fontFamily: 'var(--font-big-caslon)' } }}
          >
            Become a Superfoodie
          </Text>

          <View gap={3}>
            <View direction="row" align="start" gap={2}>
              <Text variant="body-2" color="neutral-faded">&#8226;</Text>
              <Text variant="body-2">Weekly plant-forward recipes &amp; tutorials</Text>
            </View>
            <View direction="row" align="start" gap={2}>
              <Text variant="body-2" color="neutral-faded">&#8226;</Text>
              <Text variant="body-2">Access to the shop &amp; small batch goods</Text>
            </View>
            <View direction="row" align="start" gap={2}>
              <Text variant="body-2" color="neutral-faded">&#8226;</Text>
              <Text variant="body-2">Masterclasses with top culinary artists</Text>
            </View>
            <View direction="row" align="start" gap={2}>
              <Text variant="body-2" color="neutral-faded">&#8226;</Text>
              <Text variant="body-2">Live streams &amp; exclusive content</Text>
            </View>
          </View>

          <View
            padding={4}
            align="center"
            attributes={{
              style: {
                backgroundColor: 'var(--rs-color-lavender)',
                borderRadius: '12px',
              }
            }}
          >
            <Text variant="title-5" weight="bold" align="center" attributes={{ style: { color: '#fff' } }}>
              $24.99<Text variant="body-2" attributes={{ style: { color: 'rgba(255,255,255,0.8)' } }}>/month</Text>
            </Text>
            <Text variant="caption-1" align="center" attributes={{ style: { color: 'rgba(255,255,255,0.8)' } }}>
              or $19.99/mo billed yearly
            </Text>
          </View>

          <Button
            size="xlarge"
            variant="solid"
            fullWidth
            onClick={() => {
              joinModal.deactivate();
              if (authenticated) {
                window.location.href = '/subscription';
              } else {
                // Set flag so after login they go to membership
                sessionStorage.setItem('redirect_after_login', '/dashboard/membership');
                login();
              }
            }}
          >
            Join Now
          </Button>

          <Button
            size="medium"
            variant="ghost"
            fullWidth
            onClick={joinModal.deactivate}
          >
            Maybe later
          </Button>
        </View>
      </Modal>
    </View>
  );
}
