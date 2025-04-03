import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function promoteToAdmin(email) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    console.log(`Successfully promoted ${email} to ADMIN role`);
    return user;
  } catch (error) {
    console.error('Error promoting user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.error('Please provide an email address');
  process.exit(1);
}

promoteToAdmin(email)
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 