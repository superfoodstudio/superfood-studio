import { PrismaClient } from '@prisma/client';
import { GraphQLContext } from '../context';
import { generateSlug } from '@/lib/utils';
import { paginateQuery, CursorPaginationArgs } from '@/lib/pagination';

interface RecipeFilters extends CursorPaginationArgs {
  category?: string;
  status?: 'live' | 'not-live' | 'all';
  search?: string;
  sort?: 'a-z' | 'z-a' | 'oldest' | 'newest';
}

interface PublicRecipeFilters extends CursorPaginationArgs {
  category?: string;
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
  Recipe: {
    // Resolver for the comments field
    comments: async (parent: any, _args: any, { prisma }: GraphQLContext) => {
      return prisma.comment.findMany({
        where: { recipeId: parent.id },
        orderBy: { createdAt: 'desc' }
      });
    },

    // Resolver for the ratings field
    ratings: async (parent: any, _args: any, { prisma }: GraphQLContext) => {
      return prisma.recipeRating.findMany({
        where: { recipeId: parent.id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50, // Safe limit
      });
    },

    // Resolver for the averageRating field
    averageRating: async (parent: any, _args: any, { prisma }: GraphQLContext) => {
      const ratings = await prisma.recipeRating.findMany({
        where: { recipeId: parent.id },
        select: { rating: true }
      });

      if (ratings.length === 0) {
        return null;
      }

      const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
      return Number((sum / ratings.length).toFixed(1));
    },

    // Resolver for the totalRatings field
    totalRatings: async (parent: any, _args: any, { prisma }: GraphQLContext) => {
      return prisma.recipeRating.count({
        where: { recipeId: parent.id }
      });
    }
  },

  Query: {
    recipes: async (_parent: unknown, args: RecipeFilters, { prisma }: GraphQLContext) => {
      const { category, status, search, sort, ...paginationArgs } = args;

      const baseWhere: RecipeWhereInput = {
        ...(category ? { category } : {}),
        ...(status && status !== 'all' ? { isPublished: status === 'live' } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      };

      // Determine cursor field based on sort
      let cursorField = 'uploadDate';
      if (sort === 'a-z' || sort === 'z-a') {
        cursorField = 'name';
      }

      return paginateQuery(
        prisma.recipe,
        paginationArgs,
        baseWhere,
        {
          cursorField,
          defaultLimit: 20,
          maxLimit: 100
        }
      );
    },

    // Alias for recipes connection (for admin compatibility)
    recipesConnection: async (_parent: unknown, args: RecipeFilters, { prisma, user }: GraphQLContext) => {
      // For now, allow unauthenticated access to help with debugging
      console.log('🔍 RecipesConnection resolver called with:', { 
        args, 
        userAuthenticated: user?.isAuthenticated 
      });
      
      try {
        const { category, status, search, sort, ...paginationArgs } = args;

        const baseWhere: RecipeWhereInput = {
          ...(category ? { category } : {}),
          ...(status && status !== 'all' ? { isPublished: status === 'live' } : {}),
          ...(search
            ? {
                OR: [
                  { name: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {}),
        };

        console.log('🔍 RecipesConnection baseWhere:', baseWhere);

        // Determine cursor field based on sort
        let cursorField = 'uploadDate';
        if (sort === 'a-z' || sort === 'z-a') {
          cursorField = 'name';
        }

        const result = await paginateQuery(
          prisma.recipe,
          paginationArgs,
          baseWhere,
          {
            cursorField,
            defaultLimit: 20,
            maxLimit: 100
          }
        );
        
        console.log('🔍 RecipesConnection result:', {
          edgesCount: result?.edges?.length || 0,
          hasNextPage: result?.pageInfo?.hasNextPage
        });
        
        return result;
      } catch (error) {
        console.error('🚨 RecipesConnection resolver error:', error);
        throw error;
      }
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
      const { category, ...paginationArgs } = args;
      
      const baseWhere = {
        isPublished: true,
        ...(category ? { category } : {}),
      };
      
      return paginateQuery(
        prisma.recipe,
        paginationArgs,
        baseWhere,
        {
          cursorField: 'uploadDate',
          defaultLimit: 10,
          maxLimit: 50
        }
      );
    },

  },

  Mutation: {
    rateRecipe: async (
      _parent: unknown,
      { input }: { input: { recipeId: string; rating: number } },
      { prisma, user }: GraphQLContext
    ) => {
      const { recipeId, rating } = input;
      if (!user || !user.id) {
        throw new Error('Authentication required');
      }

      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Check if rating exists, then create or update (avoiding transactions)
      let recipeRating = await prisma.recipeRating.findUnique({
        where: {
          userId_recipeId: {
            userId: user.id,
            recipeId: recipeId
          }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      if (recipeRating) {
        // Update existing rating
        recipeRating = await prisma.recipeRating.update({
          where: {
            userId_recipeId: {
              userId: user.id,
              recipeId: recipeId
            }
          },
          data: {
            rating: rating,
            updatedAt: new Date()
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        });
      } else {
        // Create new rating
        recipeRating = await prisma.recipeRating.create({
          data: {
            userId: user.id,
            recipeId: recipeId,
            rating: rating
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        });
      }

      return recipeRating;
    },

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