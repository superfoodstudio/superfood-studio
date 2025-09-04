'use client';

import { useState, useEffect } from 'react';
import Select from 'react-select/creatable';
import { View, Text } from 'reshaped';
import { useLazyLoadQuery, graphql } from 'react-relay';

interface CategoryOption {
  value: string;
  label: string;
}

interface CategoryInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isMulti?: boolean;
  entityType: 'recipe' | 'product';
}

const recipeCategoriesQuery = graphql`
  query CategoryInputRecipeCategoriesQuery {
    recipeCategories
  }
`;

const productCategoriesQuery = graphql`
  query CategoryInputProductCategoriesQuery {
    productCategories
  }
`;

// Common categories that users might want
const SUGGESTED_CATEGORIES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'smoothie', label: 'Smoothie' },
  { value: 'drink', label: 'Drink' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'detox', label: 'Detox' },
  { value: 'energy', label: 'Energy' },
  { value: 'immunity', label: 'Immunity' },
  { value: 'superfood', label: 'Superfood' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'raw', label: 'Raw' },
  { value: 'protein', label: 'Protein' },
  { value: 'antioxidant', label: 'Antioxidant' },
];

export function CategoryInput({ 
  value, 
  onChange, 
  placeholder = "Select or type a category...", 
  disabled = false,
  isMulti = false,
  entityType 
}: CategoryInputProps) {

  // Load existing categories using Relay
  const queryData = useLazyLoadQuery<any>(
    entityType === 'recipe' ? recipeCategoriesQuery : productCategoriesQuery,
    {}
  );

  const categories = entityType === 'recipe' ? 
    (queryData?.recipeCategories || []) : 
    (queryData?.productCategories || []);

  const existingCategories = categories.map((cat: string) => ({
    value: cat,
    label: cat
  }));

  // Combine existing and suggested categories, removing duplicates
  const allOptions = [
    ...existingCategories,
    ...SUGGESTED_CATEGORIES.filter(
      suggested => !existingCategories.some((existing: CategoryOption) => existing.value === suggested.value)
    )
  ].sort((a, b) => a.label.localeCompare(b.label));

  // Convert value to option format
  const selectedOption = value ? { value: value, label: value } : null;

  const handleChange = (newValue: any) => {
    if (newValue) {
      onChange(newValue.value);
    } else {
      onChange('');
    }
  };

  const handleCreateOption = (inputValue: string) => {
    // Normalize to title case for consistency
    const newValue = inputValue.trim()
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    onChange(newValue);
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: '42px',
      border: state.isFocused ? '2px solid #4A90E2' : '1px solid #E0E0E0',
      borderRadius: '6px',
      boxShadow: state.isFocused ? '0 0 0 1px #4A90E2' : 'none',
      '&:hover': {
        border: state.isFocused ? '2px solid #4A90E2' : '1px solid #B0B0B0'
      }
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#4A90E2' 
        : state.isFocused 
        ? '#F0F7FF' 
        : 'white',
      color: state.isSelected ? 'white' : '#333',
      padding: '10px 12px',
      '&:hover': {
        backgroundColor: state.isSelected ? '#4A90E2' : '#F0F7FF'
      }
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#999',
      fontSize: '14px'
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#333'
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: '#999',
      '&:hover': {
        color: '#4A90E2'
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      borderRadius: '6px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      border: '1px solid #E0E0E0'
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: '200px',
      padding: '4px'
    })
  };

  return (
    <View direction="column" gap={1}>
      <Select
        isClearable
        isSearchable
        isLoading={false}
        isDisabled={disabled}
        placeholder={placeholder}
        value={selectedOption}
        options={allOptions}
        onChange={handleChange}
        onCreateOption={handleCreateOption}
        styles={customStyles}
        formatCreateLabel={(inputValue) => `Create "${inputValue}"`}
        noOptionsMessage={() => "Type to create a new category"}
        loadingMessage={() => "Loading categories..."}
        menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
        menuPosition="fixed"
      />
      
      {existingCategories.length > 0 && (
        <Text variant="caption-1" color="neutral-faded">
          💡 Popular: {existingCategories.slice(0, 5).map((cat: CategoryOption) => cat.label).join(', ')}
          {existingCategories.length > 5 && '...'}
        </Text>
      )}
    </View>
  );
}