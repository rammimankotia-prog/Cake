import { prisma } from "./prisma";

export async function segmentCustomers() {
  const users = await prisma.user.findMany();
  const tiers = await prisma.loyaltyTier.findMany({
    orderBy: { minSpend: 'desc' }
  });

  for (const user of users) {
    const applicableTier = tiers.find(t => user.totalSpend >= t.minSpend);
    if (applicableTier && user.tierId !== applicableTier.id) {
      await prisma.user.update({
        where: { id: user.id },
        data: { tierId: applicableTier.id }
      });
    }
  }
}

export async function getTierDiscount(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { tier: true }
  });

  return user?.tier?.discountPct || 0;
}

export async function sendBirthdayOffers() {
  const today = new Date();
  const birthdayUsers = await prisma.user.findMany({
    where: {
      birthday: {
        // Simple logic for birth month/day matching
        equals: today
      }
    },
    include: { tier: true }
  });

  for (const user of birthdayUsers) {
    const discount = user.tier?.name === 'VIP' ? 20 : 10;
    console.log(`Sending ${discount}% birthday offer to ${user.email}`);
    // Here we would trigger an email via Resend or Nodemailer
  }
}
