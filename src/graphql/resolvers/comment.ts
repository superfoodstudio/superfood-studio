import { GraphQLContext } from '../context';

async function requireAdmin(context: GraphQLContext) {
  const user = await context.getFullUser();
  if (!user?.isAuthenticated || user.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  return user;
}

interface CreateCommentInput {
  content: string;
  author: string;
  email?: string;
  recipeId: string;
}

export const commentResolvers = {
  Query: {
    recipeComments: async (_parent: unknown, { recipeId }: { recipeId: string }, { prisma }: GraphQLContext) => {
      return prisma.comment.findMany({
        where: {
          recipeId,
          isHidden: false // Only show non-hidden comments to public
        },
        include: {
          recipe: true
        },
        orderBy: {
          createdAt: 'asc'
        },
        take: 100
      });
    },

    recipeCommentsConnection: async (
      _parent: unknown,
      { recipeId, first = 10, after }: { recipeId: string; first?: number; after?: string },
      { prisma }: GraphQLContext
    ) => {
      const where = {
        recipeId,
        isHidden: false,
        ...(after ? { id: { gt: after } } : {})
      };

      // Get total count
      const totalCount = await prisma.comment.count({
        where: {
          recipeId,
          isHidden: false
        }
      });

      const comments = await prisma.comment.findMany({
        where,
        take: first + 1, // Take one extra to check if there are more
        orderBy: { createdAt: 'asc' },
        include: { recipe: true }
      });

      const hasNextPage = comments.length > first;
      const nodes = hasNextPage ? comments.slice(0, -1) : comments;

      const edges = nodes.map((comment) => ({
        cursor: comment.id,
        node: comment
      }));

      return {
        edges,
        pageInfo: {
          hasNextPage,
          hasPreviousPage: !!after,
          startCursor: edges.length > 0 ? edges[0].cursor : null,
          endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
        },
        totalCount
      };
    },
  },

  Mutation: {
    createComment: async (
      _parent: unknown,
      { input }: { input: CreateCommentInput },
      context: GraphQLContext
    ) => {
      if (!context.user?.isAuthenticated) {
        throw new Error('Authentication required to create comments');
      }
      const { prisma } = context;
      // Validate content length (max 500 characters)
      if (input.content.length > 500) {
        throw new Error('Comment content cannot exceed 500 characters');
      }

      if (input.content.trim().length === 0) {
        throw new Error('Comment content cannot be empty');
      }

      const comment = await prisma.comment.create({
        data: {
          content: input.content.trim(),
          author: input.author.trim(),
          email: input.email?.trim(),
          recipeId: input.recipeId
        },
        include: {
          recipe: true
        }
      });

      return comment;
    },

    hideComment: async (
      _parent: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      await requireAdmin(context);
      const { prisma } = context;
      const comment = await prisma.comment.update({
        where: { id },
        data: { isHidden: true },
        include: {
          recipe: true
        }
      });

      return comment;
    },

    deleteComment: async (
      _parent: unknown,
      { id }: { id: string },
      context: GraphQLContext
    ) => {
      await requireAdmin(context);
      const { prisma } = context;
      await prisma.comment.delete({
        where: { id }
      });

      return { success: true };
    },
  },

  Comment: {
    recipe: (parent: any) => parent.recipe,
    author: (parent: any) => {
      const author = parent.author;
      if (!author || author === 'null null' || !author.trim()) {
        return 'Anonymous';
      }
      return author;
    },
  },
};