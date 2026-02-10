import { GraphQLContext } from '../context';
import { withRetry } from '@/lib/db-utils';

interface UpdateSiteSettingsInput {
  homepageVideoUrl?: string;
}

export const siteSettingsResolvers = {
  Query: {
    siteSettings: async (_parent: unknown, _args: unknown, context: GraphQLContext) => {
      if (!context.prisma) {
        throw new Error('Prisma client not available in context');
      }
      
      // Get or create the first (and only) site settings record with retry
      return await withRetry(async () => {
        let settings = await context.prisma.siteSettings.findFirst();
        
        if (!settings) {
          settings = await context.prisma.siteSettings.create({
            data: {}
          });
        }
        
        return settings;
      }, { maxRetries: 2, delay: 1000 });
    },
  },

  Mutation: {
    updateSiteSettings: async (
      _parent: unknown,
      { input }: { input: UpdateSiteSettingsInput },
      context: GraphQLContext
    ) => {
      // Require admin for updating site settings
      const user = await context.getFullUser();
      if (!user?.isAuthenticated || user.role !== 'ADMIN') {
        throw new Error('Admin access required');
      }

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