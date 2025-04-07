import { Prisma } from '@prisma/client';
import { GraphQLContext } from '../context';

interface RecipeFilters {
  category?: string;
  status?: 'live' | 'not-live' | 'all';
  search?: string;
  sort?: 'a-z' | 'z-a' | 'oldest' | 'newest';
}

export const recipeResolvers = {
  Query: {
    recipes: async (_parent: unknown, args: RecipeFilters, { prisma }: GraphQLContext) => {
      const { category, status, search, sort } = args;

      let orderBy: Prisma.RecipeOrderByWithRelationInput = {};
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

      const where: Prisma.RecipeWhereInput = {
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
  },

  Mutation: {
    createRecipe: async (
      _parent: unknown,
      { input }: { input: Omit<Prisma.RecipeCreateInput, 'status'> },
      { prisma }: GraphQLContext
    ) => {
      return prisma.recipe.create({
        data: {
          ...input,
          isPublished: false,
          uploadDate: new Date(),
        },
      });
    },

    updateRecipe: async (
      _parent: unknown,
      { id, input }: { id: string; input: Prisma.RecipeUpdateInput },
      { prisma }: GraphQLContext
    ) => {
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