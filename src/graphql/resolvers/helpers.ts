export async function requireActiveSubscription(prisma: any, userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: { userId, status: 'ACTIVE' }
  });
  if (!subscription) {
    throw new Error('Active subscription required');
  }
  if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < new Date()) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'EXPIRED' }
    });
    throw new Error('Subscription has expired');
  }
  return subscription;
}
