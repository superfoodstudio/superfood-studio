import { PrismaClient } from '@prisma/client';
import { GraphQLContext } from '../context';
import { generateSlug } from '@/lib/utils';

interface RecipeFilters {
  category?: string;
  status?: 'live' | 'not-live' | 'all';
  search?: string;
  sort?: 'a-z' | 'z-a' | 'oldest' | 'newest';
}

interface PublicRecipeFilters {
  category?: string;
  limit?: number;
  offset?: number;
}

// Define our own types for Prisma queries
type RecipeOrderByWithRelationInput = {
  name?: 'asc' | 'desc';
  uploadDate?: 'asc' | 'desc';
};

type RecipeWhereInput = {
  category?: string;
  status?: string;
  isPublished?: boolean;
  OR?: Array<{
    name?: { contains: string; mode: 'insensitive' };
    description?: { contains: string; mode: 'insensitive' };
  }>;
};

// Define input types explicitly
interface RecipeCreateInput {
  name: string;
  slug: string;
  description: string;
  category: string;
  isPublished: boolean;
  mediaUrl: string;
  uploadDate: Date;
  ingredients?: string[];
  instructions?: string[];
}

interface RecipeUpdateInput {
  name?: string;
  slug?: string;
  description?: string;
  category?: string;
  isPublished?: boolean;
  mediaUrl?: string;
  ingredients?: string[];
  instructions?: string[];
}

export const recipeResolvers = {
  Query: {
    recipes: async (_parent: unknown, args: RecipeFilters, { prisma }: GraphQLContext) => {
      const { category, status, search, sort } = args;

      let orderBy: RecipeOrderByWithRelationInput = {};
      switch (sort) {
        case 'a-z':
          orderBy = { name: 'asc' };
          break;
        case 'z-a':
          orderBy = { name: 'desc' };
          break;
        case 'oldest':
          orderBy = { uploadDate: 'asc' };
          break;
        default:
          orderBy = { uploadDate: 'desc' };
      }

      const where: RecipeWhereInput = {
        ...(category ? { category } : {}),
        ...(status && status !== 'all' ? { status } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      };

      return prisma.recipe.findMany({
        where,
        orderBy,
      });
    },

    recipe: async (_parent: unknown, { id }: { id: string }, { prisma }: GraphQLContext) => {
      return prisma.recipe.findUnique({
        where: { id },
      });
    },
    
    recipeBySlug: async (_parent: unknown, { slug }: { slug: string }, { prisma }: GraphQLContext) => {
      return prisma.recipe.findUnique({
        where: { slug },
      });
    },
    
    publicRecipes: async (_parent: unknown, args: PublicRecipeFilters, { prisma, user }: GraphQLContext) => {
      const { category, limit = 10, offset = 0 } = args;
      
      // For public recipes, we only show published recipes
      const where: RecipeWhereInput = {
        isPublished: true,
        ...(category ? { category } : {}),
      };
      
      return prisma.recipe.findMany({
        where,
        orderBy: { uploadDate: 'desc' },
        take: limit,
        skip: offset,
      });
    },
  },

  Mutation: {
    createRecipe: async (
      _parent: unknown,
      { input }: { input: Omit<RecipeCreateInput, 'slug' | 'isPublished' | 'uploadDate'> },
      { prisma }: GraphQLContext
    ) => {
      // Generate a slug from the name
      const slug = generateSlug(input.name);
      
      return prisma.recipe.create({
        data: {
          ...input,
          slug,
          isPublished: false,
          uploadDate: new Date(),
        },
      });
    },

    updateRecipe: async (
      _parent: unknown,
      { id, input }: { id: string; input: RecipeUpdateInput },
      { prisma }: GraphQLContext
    ) => {
      // If name is updated, generate a new slug
      if (input.name) {
        const recipe = await prisma.recipe.findUnique({ where: { id } });
        if (recipe && recipe.name !== input.name) {
          input.slug = generateSlug(input.name);
        }
      }
      
      return prisma.recipe.update({
        where: { id },
        data: input,
      });
    },

    deleteRecipe: async (_parent: unknown, { id }: { id: string }, { prisma }: GraphQLContext) => {
      try {
        await prisma.recipe.delete({
          where: { id },
        });
        return { success: true };
      } catch (error) {
        console.error('Error deleting recipe:', error);
        return { success: false };
      }
    },

    toggleRecipeStatus: async (_parent: unknown, { id }: { id: string }, { prisma }: GraphQLContext) => {
      const recipe = await prisma.recipe.findUnique({
        where: { id },
      });

      if (!recipe) {
        throw new Error('Recipe not found');
      }

      return prisma.recipe.update({
        where: { id },
        data: {
          isPublished: !recipe.isPublished,
        },
      });
    },
  },
}; 