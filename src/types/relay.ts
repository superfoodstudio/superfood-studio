/**
 * Types for Relay operations
 * 
 * This file contains TypeScript interfaces for GraphQL operations used in the application.
 */

import { RecipeDetailFragment } from "@/graphql/queries/RecipeQueries";
import { recipeCardFragment as RecipeCardFragment } from "@/components/recipes/RecipeCard";
import { ProductCardFragment } from "@/components/products/ProductCard";
import { ProductDetailFragment } from "@/graphql/queries/ProductQueries";
import { CartDetailsFragment } from "@/graphql/queries/CartQueries";

// Recipe Types
export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  isPublished: boolean;
  mediaUrl: string;
  uploadDate: string;
  createdAt: string;
  updatedAt: string;
  ingredients?: string[];
  instructions?: string[];
}

export interface RecipeCardData {
  id: string;
  name: string;
  description: string;
  category: string;
  mediaUrl: string;
  uploadDate: string;
}

export interface RecipeDetailData extends RecipeCardData {
  ingredients: string[];
  instructions: string[];
  createdAt: string;
}

export type RecipeCardFragmentRef = any; // Relay fragment reference type

export type RecipeDetailFragmentRef = any; // Relay fragment reference type

export interface RecipeListQueryResponse {
  publicRecipes: Array<{
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly category: string;
    readonly mediaUrl: string;
    readonly uploadDate: string;
  } & RecipeCardFragmentRef>;
}

export interface RecipeDetailQueryResponse {
  recipe: ({
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly category: string;
    readonly mediaUrl: string;
    readonly uploadDate: string;
    readonly ingredients: ReadonlyArray<string> | null;
    readonly instructions: ReadonlyArray<string> | null;
    readonly createdAt: string;
  } & RecipeDetailFragmentRef) | null;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  videoUrl?: string | null;
  price: number;
  category: string;
  tags: string[];
  inventory: number;
  isActive: boolean;
}

export interface ProductCardData {
  id: string;
  name: string;
  description: string;
  photoUrl: string;
  price: number;
  category: string;
  tags: string[];
}

export interface ProductDetailData extends ProductCardData {
  videoUrl?: string | null;
  inventory: number;
}

export type ProductCardFragmentRef = any; // Relay fragment reference type

export type ProductDetailFragmentRef = any; // Relay fragment reference type

export interface ProductListQueryResponse {
  productsByCategory: Array<{
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly photoUrl: string;
    readonly price: number;
    readonly category: string;
    readonly tags: ReadonlyArray<string>;
  } & ProductCardFragmentRef>;
}

export interface ProductDetailQueryResponse {
  product: ({
    readonly id: string;
    readonly name: string;
    readonly description: string;
    readonly photoUrl: string;
    readonly videoUrl: string | null;
    readonly price: number;
    readonly category: string;
    readonly tags: ReadonlyArray<string>;
    readonly inventory: number;
  } & ProductDetailFragmentRef) | null;
}

// Cart Types
export interface CartItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    photoUrl: string;
  };
}

export interface Cart {
  id: string;
  total: number;
  items: CartItem[];
}

export type CartDetailsFragmentRef = any; // Relay fragment reference type

export interface CartQueryResponse {
  cart: ({
    readonly id: string;
    readonly total: number;
    readonly items: ReadonlyArray<{
      readonly id: string;
      readonly quantity: number;
      readonly price: number;
      readonly product: {
        readonly id: string;
        readonly name: string;
        readonly photoUrl: string;
      };
    }>;
  } & CartDetailsFragmentRef) | null;
}

// Operation types for usePreloadedQuery and useLazyLoadQuery
export interface RecipeListQueryType {
  readonly response: RecipeListQueryResponse;
  readonly variables: {
    category?: string;
    limit?: number;
    offset?: number;
  };
}

export interface RecipeDetailQueryType {
  readonly response: RecipeDetailQueryResponse;
  readonly variables: {
    id: string;
  };
}

export interface ProductListQueryType {
  readonly response: ProductListQueryResponse;
  readonly variables: {
    category: string;
    limit?: number;
    offset?: number;
  };
}

export interface ProductDetailQueryType {
  readonly response: ProductDetailQueryResponse;
  readonly variables: {
    id: string;
  };
}

export interface CartQueryType {
  readonly response: CartQueryResponse;
  readonly variables: Record<string, never>;
} 