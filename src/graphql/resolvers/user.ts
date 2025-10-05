import { prisma } from '@/lib/prisma';

async function getCurrentUserId(context: any): Promise<string | null> {
  try {
    // First check if we have basic auth
    if (!context.user?.isAuthenticated) {
      return null;
    }

    // If we don't have full user data, fetch it lazily
    if (!context.user.id && context.getFullUser) {
      const fullUser = await context.getFullUser();
      return fullUser.isAuthenticated ? fullUser.id || null : null;
    }

    return context.user.id || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export const userResolvers = {
  Query: {
    currentUser: async (_parent: any, _args: any, context: any) => {
      try {
        console.log('currentUser resolver called');
        console.log('Context user:', context.user);

        const userId = await getCurrentUserId(context);
        console.log('Resolved userId:', userId);

        if (!userId) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        console.log('Found user:', user);

        if (!user) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };
      } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
      }
    },
  },
  Mutation: {
    updateUser: async (_parent: any, args: any, context: any) => {
      try {
        console.log('updateUser mutation called with args:', args);

        const userId = await getCurrentUserId(context);
        console.log('Resolved userId:', userId);

        if (!userId) {
          throw new Error('You must be logged in to update your profile');
        }

        const { firstName, lastName, email } = args.input;

        // Build update object with only provided fields
        const updateData: any = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (email !== undefined) updateData.email = email;

        console.log('Updating user with data:', updateData);

        const updatedUser = await prisma.user.update({
          where: {
            id: userId,
          },
          data: updateData,
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        console.log('Updated user:', updatedUser);

        return {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          createdAt: updatedUser.createdAt.toISOString(),
          updatedAt: updatedUser.updatedAt.toISOString(),
        };
      } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user profile');
      }
    },
  },
};