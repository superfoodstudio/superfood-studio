import { PrismaClient } from '@prisma/client';
import { GraphQLContext } from '../context';
import { generateSlug } from '@/lib/utils';
import { paginateQuery, CursorPaginationArgs, validatePaginationArgs, createCursorWhere, createConnection, createCursor, parseCursor } from '@/lib/pagination';
import { requireActiveSubscription } from './helpers';

async function requireAdmin(context: GraphQLContext) {
  const user = await context.getFullUser();
  if (!user?.isAuthenticated || user.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  return user;
}

interface RecipeFilters extends CursorPaginationArgs {
  category?: string;
  status?: 'live' | 'not-live' | 'all';
  search?: string;
  sort?: 'a-z' | 'z-a' | 'oldest' | 'newest';
}

interface PublicRecipeFilters extends CursorPaginationArgs {
  category?: string;
  sort?: string;
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
  servingSize?: string;
  totalTime?: number;
  prepTime?: number;
  cookTime?: number;
  isPublished: boolean;
  mediaUrl: string;
  uploadDate: Date;
  ingredients?: string;
  instructions?: string;
}

interface RecipeUpdateInput {
  name?: string;
  slug?: string;
  description?: string;
  category?: string;
  servingSize?: string;
  totalTime?: number;
  prepTime?: number;
  cookTime?: number;
  isPublished?: boolean;
  mediaUrl?: string;
  ingredients?: string;
  instructions?: string;
}

export const recipeResolvers = {
  Recipe: {
    // Resolver for the comments field
    comments: async (parent: any, _args: any, { prisma }: GraphQLContext) => {
      return prisma.comment.findMany({
        where: { recipeId: parent.id },
        orderBy: { createdAt: 'desc' },
        take: 100
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

    // Resolver for the averageRating field (uses aggregate instead of fetching all rows)
    averageRating: async (parent: any, _args: any, { prisma }: GraphQLContext) => {
      const result = await prisma.recipeRating.aggregate({
        where: { recipeId: parent.id },
        _avg: { rating: true },
        _count: { rating: true },
      });

      if (result._count.rating === 0) {
        return null;
      }

      return result._avg.rating ? Number(result._avg.rating.toFixed(1)) : null;
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

      // Determine cursor field and order based on sort (same logic as publicRecipes)
      let cursorField = 'uploadDate';
      let sortOrder: 'asc' | 'desc' = 'desc';
      
      switch (sort) {
        case 'a-z':
          cursorField = 'name';
          sortOrder = 'asc';
          break;
        case 'z-a':
          cursorField = 'name';
          sortOrder = 'desc';
          break;
        case 'oldest':
          cursorField = 'uploadDate';
          sortOrder = 'asc';
          break;
        case 'newest':
        default:
          cursorField = 'uploadDate';
          sortOrder = 'desc';
          break;
      }

      return paginateQuery(
        prisma.recipe,
        paginationArgs,
        baseWhere,
        {
          cursorField,
          sortOrder,
          defaultLimit: 20,
          maxLimit: 100
        }
      );
    },

    recipe: async (_parent: unknown, { id }: { id: string }, { prisma }: GraphQLContext) => {
      return prisma.recipe.findUnique({
        where: { id },
      });
    },
    
    recipeBySlug: async (_parent: unknown, { slug }: { slug: string }, context: GraphQLContext) => {
      const { prisma } = context;
      const fullUser = await context.getFullUser();
      if (!fullUser?.isAuthenticated) {
        throw new Error('Authentication required to view recipes');
      }
      // Non-admin users need active subscription
      if (fullUser.role !== 'ADMIN') {
        await requireActiveSubscription(prisma, fullUser.id!);
      }
      return prisma.recipe.findUnique({
        where: { slug },
      });
    },

    publicRecipes: async (_parent: unknown, args: PublicRecipeFilters, context: GraphQLContext) => {
      const { prisma } = context;
      const fullUser = await context.getFullUser();
      if (!fullUser?.isAuthenticated) {
        throw new Error('Authentication required to view recipes');
      }
      // Non-admin users need active subscription
      if (fullUser.role !== 'ADMIN') {
        await requireActiveSubscription(prisma, fullUser.id!);
      }
      const { category, sort, ...paginationArgs } = args;

      const baseWhere = {
        isPublished: true,
        ...(category ? { category } : {}),
      };
      
      // Determine cursor field and order based on sort
      let cursorField = 'uploadDate';
      let sortOrder: 'asc' | 'desc' = 'desc';
      
      switch (sort) {
        case 'a-z':
          cursorField = 'name';
          sortOrder = 'asc';
          break;
        case 'z-a':
          cursorField = 'name';
          sortOrder = 'desc';
          break;
        case 'oldest':
          cursorField = 'uploadDate';
          sortOrder = 'asc';
          break;
        case 'newest':
        default:
          cursorField = 'uploadDate';
          sortOrder = 'desc';
          break;
      }
      
      return paginateQuery(
        prisma.recipe,
        paginationArgs,
        baseWhere,
        {
          cursorField,
          sortOrder,
          defaultLimit: 12,
          maxLimit: 50
        }
      );
    },

    recipeCategories: async (_parent: unknown, _args: unknown, { prisma }: GraphQLContext) => {
      const categories = await prisma.recipe.findMany({
        select: { category: true },
        distinct: ['category'],
        where: {
          category: {
            not: ''
          }
        }
      });

      return categories
        .map(r => r.category)
        .filter(Boolean)
        .sort();
    },

    featuredRecipe: async (_parent: unknown, _args: unknown, { prisma }: GraphQLContext) => {
      return prisma.recipe.findFirst({
        where: { isFeatured: true, isPublished: true },
      });
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
      context: GraphQLContext
    ) => {
      await requireAdmin(context);
      const { prisma } = context;
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
      context: GraphQLContext
    ) => {
      await requireAdmin(context);
      const { prisma } = context;
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

    deleteRecipe: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      await requireAdmin(context);
      const { prisma } = context;
      try {
        await prisma.recipe.delete({
          where: { id },
        });
        return { success: true };
      } catch (error) {
        console.error(error);
        return { success: false };
      }
    },

    toggleRecipeStatus: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      await requireAdmin(context);
      const { prisma } = context;
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

    setFeaturedRecipe: async (_parent: unknown, { id }: { id: string }, context: GraphQLContext) => {
      await requireAdmin(context);
      const { prisma } = context;
      return prisma.$transaction(async (tx) => {
        await tx.recipe.updateMany({
          where: { isFeatured: true },
          data: { isFeatured: false },
        });
        return tx.recipe.update({
          where: { id },
          data: { isFeatured: true },
        });
      });
    },
  },
}; 