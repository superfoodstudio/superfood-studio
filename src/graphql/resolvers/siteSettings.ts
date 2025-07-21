import { GraphQLContext } from '../context';

interface UpdateSiteSettingsInput {
  homepageVideoUrl?: string;
}

export const siteSettingsResolvers = {
  Query: {
    siteSettings: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      console.log('siteSettings resolver called');
      console.log('Context keys:', Object.keys(context));
      console.log('Prisma available:', !!context.prisma);
      
      if (!context.prisma) {
        throw new Error('Prisma client not available in context');
      }
      
      // Get or create the first (and only) site settings record
      let settings = await context.prisma.siteSettings.findFirst();
      
      if (!settings) {
        settings = await context.prisma.siteSettings.create({
          data: {}
        });
      }
      
      return settings;
    },
  },

  Mutation: {
    updateSiteSettings: async (
      _parent: unknown,
      { input }: { input: UpdateSiteSettingsInput },
      context: GraphQLContext
    ) => {
      console.log('updateSiteSettings resolver called');
      console.log('Context keys:', Object.keys(context));
      console.log('Prisma available:', !!context.prisma);
      console.log('Input:', input);
      
      if (!context.prisma) {
        throw new Error('Prisma client not available in context');
      }
      
      // Get or create the first (and only) site settings record
      let settings = await context.prisma.siteSettings.findFirst();
      
      if (!settings) {
        settings = await context.prisma.siteSettings.create({
          data: input
        });
      } else {
        settings = await context.prisma.siteSettings.update({
          where: { id: settings.id },
          data: input
        });
      }
      
      return settings;
    },
  },
};