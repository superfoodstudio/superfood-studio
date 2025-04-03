const { AuthService } = require('../src/lib/auth');

async function promoteToAdmin(email: string) {
  try {
    const authService = AuthService.getInstance();
    const user = await authService.promoteToAdmin(email);
    console.log(`Successfully promoted ${email} to ADMIN role`);
    return user;
  } catch (error) {
    console.error('Error promoting user:', error);
    throw error;
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