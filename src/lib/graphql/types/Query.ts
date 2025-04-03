import { builder } from '../builder';
import { Context } from '../context';

builder.queryType({
  fields: (t) => ({
    // User queries
    me: t.prismaField({
      type: 'User',
      nullable: true,
      resolve: async (query, _root, _args, ctx: Context) => {
        if (!ctx.user?.id) return null;
        return await ctx.prisma.user.findUnique({
          ...query,
          where: { id: ctx.user.id },
        });
      },
    }),

    // Recipe queries
    recipes: t.prismaField({
      type: ['Recipe'],
      resolve: async (query, _root, _args, ctx: Context) => {
        return await ctx.prisma.recipe.findMany({
          ...query,
          where: { isPublished: true },
        });
      },
    }),

    recipe: t.prismaField({
      type: 'Recipe',
      nullable: true,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (query, _root, args, ctx: Context) => {
        return await ctx.prisma.recipe.findUnique({
          ...query,
          where: { id: args.id },
        });
      },
    }),

    // Product queries
    products: t.prismaField({
      type: ['Product'],
      resolve: async (query, _root, _args, ctx: Context) => {
        return await ctx.prisma.product.findMany({
          ...query,
          where: { isActive: true },
        });
      },
    }),

    product: t.prismaField({
      type: 'Product',
      nullable: true,
      args: {
        id: t.arg.string({ required: true }),
      },
      resolve: async (query, _root, args, ctx: Context) => {
        return await ctx.prisma.product.findUnique({
          ...query,
          where: { id: args.id },
        });
      },
    }),
  }),
}); 