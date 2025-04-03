'use client';

import { View, Text, Button, Select } from 'reshaped';
import { useState } from 'react';

export default function RecipesAdmin() {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('newest');
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  return (
    <View direction="column" gap={6}>
      <View direction="row" justify="space-between" align="center">
        <Text variant="title-2">RECIPES</Text>
        <Button variant="solid">ADD A RECIPE</Button>
      </View>

      <View direction="row" gap={8}>
        {/* Filters */}
        <View as="aside" direction="column" gap={4}>
          <View direction="column" gap={2}>
            <Text variant="body-2">CATEGORY</Text>
            <Select
              name="category"
              value={category}
              onChange={value => setCategory(String(value))}
              options={[
                { value: 'all', label: 'All' },
                { value: 'beauty', label: 'Beauty' },
                { value: 'food', label: 'Food' },
                { value: 'wellness', label: 'Wellness' },
              ]}
            />
          </View>

          <View direction="column" gap={2}>
            <Text variant="body-2">SORT</Text>
            <Select
              name="sort"
              value={sort}
              onChange={value => setSort(String(value))}
              options={[
                { value: 'a-z', label: 'A to Z' },
                { value: 'z-a', label: 'Z to A' },
                { value: 'newest', label: 'Newest to Oldest' },
                { value: 'oldest', label: 'Oldest to Newest' },
              ]}
            />
          </View>

          <View direction="column" gap={2}>
            <Text variant="body-2">STATUS</Text>
            <Select
              name="status"
              value={status}
              onChange={value => setStatus(String(value))}
              options={[
                { value: 'all', label: 'All' },
                { value: 'live', label: 'Live' },
                { value: 'not-live', label: 'Not Live' },
              ]}
            />
          </View>

          <Button variant="outline">SAVE</Button>
        </View>

        {/* Recipe Grid */}
        <View as="section" direction="column" gap={4}>
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #e5e7eb',
            }}
          />

          <View direction="row" gap={4} wrap>
            {/* Recipe cards will be rendered here */}
            <Text variant="body-1" color="neutral">No recipes found.</Text>
          </View>
        </View>
      </View>
    </View>
  );
} 