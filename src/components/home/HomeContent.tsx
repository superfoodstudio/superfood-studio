'use client';

import { View, Text, Button } from 'reshaped';
import Link from 'next/link';
import Image from 'next/image';

export function HomeContent() {
  return (
    <View as="main" direction="column">
      {/* Hero Image Section */}
      <View as="section">
        <Image
          src="/images/hero.jpg"
          alt="Cooking ingredients"
          width={1200}
          height={400}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover',
          }}
        />
      </View>

      {/* From the Founders Section */}
      <View
        as="section"
        direction="column"
        align="center"
        gap={4}
        padding={8}
        backgroundColor="warning-faded"
      >
        <Text variant="featured-2" align="center">
          FROM THE FOUNDERS OF SOL SIPS
        </Text>
        <Text variant="body-1" align="center" color="neutral">
          a plant-forward concept studio with a new collection of audio-visual recipes and superfood-centric tutorials every month
        </Text>
        <Button variant="solid">LEARN MORE</Button>
      </View>

      {/* Become a Superfoodie Section */}
      <View
        as="section"
        direction="column"
        align="center"
        gap={4}
        padding={8}
        backgroundColor="primary-faded"
      >
        <Text variant="featured-2" align="center">
          BECOME A SUPERFOODIE
        </Text>
        <Text variant="body-1" align="center" color="neutral">
          everything you&apos;ll need to curate quality, fresh meals at home
        </Text>
        <Link href="/shop">
          <Button variant="outline">SHOP NOW</Button>
        </Link>
      </View>

      {/* Monthly Recipes Section */}
      <View
        as="section"
        direction="column"
        align="center"
        gap={4}
        padding={8}
        backgroundColor="positive-faded"
      >
        <Text variant="featured-2" align="center">
          MONTHLY RECIPES
        </Text>
        <Text variant="body-1" align="center" color="neutral">
          let&apos;s get cooking
        </Text>
        <Link href="/recipes">
          <Button variant="solid">VIEW RECIPES</Button>
        </Link>
      </View>

      {/* Instagram Feed Section */}
      <View as="section" direction="column" align="center" gap={4} padding={8}>
        <Text variant="title-2" align="center">
          SEE WHAT&apos;S HAPPENING IN THE STUDIO
        </Text>
        <View direction="row" gap={2} wrap justify="center">
          {/* We'll replace these with actual Instagram feed later */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View
              key={i}
              width={180}
              height={180}
              backgroundColor="elevation-base"
            />
          ))}
        </View>
        <Link href="https://instagram.com/superfoodstudio" target="_blank">
          <Text variant="body-2" align="center">
            @SUPERFOODSTUDIO
          </Text>
        </Link>
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
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
            }}
          />
          <Button variant="solid">STAY IN TOUCH →</Button>
        </View>
      </View>
    </View>
  );
} 