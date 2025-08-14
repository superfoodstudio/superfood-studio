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
    { fetchPolicy: "store-or-network" }
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
        style={{
          width: "100%",
          maxHeight: "66vh",
          objectFit: "cover",
          borderRadius: "24px",
          display: "block",
        }}
      >
        <source src={videoUrl} type="video/mp4" />
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
          maxWidth: '1280px',
          margin: '0 auto'
        }
      }}
    >
      {/* Hero Video Section */}
      <View padding={{ s: 0, m: 4 }}>
        <Suspense fallback={<HeroVideoLoading />}>
          <HeroVideoSection />
        </Suspense>
      </View>

      {/* Your Culinary Playhouse Section */}
      <View padding={{ s: 0, m: 4 }}>
        <View 
          as="section"
          padding={8}
        attributes={{
          style: {
            backgroundColor: 'var(--rs-color-lime-green)',
            borderRadius: '24px'
          }
        }}
      >
        <View direction="column" align="center" gap={6}>
          {/* Title */}
          <View direction="column" align="center" gap={0}>
            <Text
              variant="title-1"
              attributes={{
                style: {
                  fontFamily: 'var(--font-midruns-sans)',
                  color: 'var(--rs-color-forest-green)',
                  fontSize: '3.5rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  lineHeight: '1.1',
                  marginBottom: '-10px'
                }
              }}
            >
              YOUR
            </Text>
            <Text
              variant="title-1"
              attributes={{
                style: {
                  fontFamily: 'var(--font-midruns-script)',
                  color: 'var(--rs-color-forest-green)',
                  fontSize: '4rem',
                  fontWeight: '400',
                  lineHeight: '1.1',
                  marginBottom: '-8px'
                }
              }}
            >
              Culinary
            </Text>
            <Text
              variant="title-1"
              attributes={{
                style: {
                  fontFamily: 'var(--font-midruns-sans)',
                  color: 'var(--rs-color-forest-green)',
                  fontSize: '3.5rem',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  lineHeight: '1.1'
                }
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
          direction={{ s: "column", m: "row" }}
        gap={0}
        attributes={{
          style: {
            borderRadius: '24px',
            overflow: 'hidden'
          }
        }}
      >
        {/* Left Section - Beige */}
        <View 
          direction="column" 
          gap={4} 
          padding={8}
          attributes={{ 
            style: { 
              flex: 1,
              backgroundColor: 'var(--rs-color-beige)'
            } 
          }}
        >
          <Text
            variant="body-1"
            attributes={{
              style: {
                fontSize: '2.2rem',
                fontWeight: '600',
                lineHeight: '1.2',
                color: 'var(--rs-color-forest-green)'
              }
            }}
          >
            Become a<br />Superfoodie
          </Text>
          <Text
            variant="body-2"
            color="neutral-faded"
            attributes={{
              style: {
                fontSize: '1rem',
                lineHeight: '1.6',
                marginBottom: '1rem'
              }
            }}
          >
            Learn the craft of building a plant-forward plate.
          </Text>
          <Text
            variant="body-2"
            color="neutral"
            attributes={{
              style: {
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }
            }}
          >
            Unlock access to weekly recipes, special offers on our small-batch goods, quarterly master-classes with top culinary artists and member rates on our in-person garden-to-table activations.
          </Text>
        </View>

        {/* Right Section - Light Blue */}
        <View
          padding={8}
          attributes={{
            style: {
              flex: 1,
              backgroundColor: 'var(--rs-color-light-blue)',
              minHeight: '320px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }
          }}
        >
          {/* Empty light blue section as shown in image */}
        </View>
        </View>
      </View>

      {/* From the Founders Section */}
      <View padding={{ s: 0, m: 4 }}>
        <View
          as="section"
          direction="column"
        align="center"
        gap={4}
        padding={8}
        attributes={{
          style: {
            backgroundColor: "var(--rs-color-coral-red)",
            borderRadius: "24px",
          },
        }}
      >
        <View
          maxWidth="600px"
          width="100%"
          paddingInline={4}
          attributes={{
            style: {
              margin: "0 auto",
            },
          }}
        >
          <View divided={true} gap={4}>
            <Text
              variant="featured-2"
              align="center"
              attributes={{
                style: {
                  fontFamily: "var(--font-midruns-sans)",
                  letterSpacing: "1.28px",
                  textTransform: "uppercase",
                },
              }}
            >
              From the founders of Sol Sips
            </Text>
            <Text variant="body-2" align="center" color="neutral">
              Reimagine your relationship with cooking in our culinary
              playhouse. We generate vibrant recipes for our members to explore
              in the comfort of their home. Think of us as your creative kitchen
              companion serving flavorful meals rooted in joy and simplicity.
            </Text>
          </View>
        </View>
        <Button variant="outline">LEARN MORE</Button>
        </View>
      </View>


      {/* Newsletter Section */}
      <View padding={{ s: 0, m: 4 }}>
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
          <label htmlFor="subscribeConsent" style={{ fontSize: "0.8rem" }}>
            Subscribe to receive communications for exclusive offers and events
            from Superfood Studio. By subscribing, you confirm you have read and
            understood our privacy policy.
          </label>
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
