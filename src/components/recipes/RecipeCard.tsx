'use client';

import { View, Text, Button } from 'reshaped';
import Image from 'next/image';

interface RecipeCardProps {
  id: string;
  title: string;
  status: string;
  mediaUrl: string;
  uploadedAt: string;
  onToggleStatus: (id: string) => void;
}

export function RecipeCard({
  id,
  title,
  status,
  mediaUrl,
  uploadedAt,
  onToggleStatus,
}: RecipeCardProps) {
  return (
    <View
      as="article"
      direction="column"
      gap={2}
      backgroundColor="elevation-base"
      padding={4}
      attributes={{
        style: {
          borderRadius: '8px',
        },
      }}
    >
      <View position="relative" height={200}>
        <Image
          src={mediaUrl}
          alt={title}
          fill
          style={{ objectFit: 'cover', borderRadius: '4px' }}
        />
      </View>

      <View direction="column" gap={1}>
        <Text variant="featured-2">{title}</Text>
        <Text variant="body-2" color="neutral-faded">
          uploaded: {uploadedAt}
        </Text>
      </View>

      <View direction="row" gap={2} align="center">
        <Text variant="body-2">recipe is {status}</Text>
        <Button
          variant="ghost"
          size="small"
          onClick={() => onToggleStatus(id)}
        >
          👁
        </Button>
      </View>
    </View>
  );
} 