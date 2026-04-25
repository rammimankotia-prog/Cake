const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.variant.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.loyaltyTier.deleteMany();

  // Create Loyalty Tiers
  await prisma.loyaltyTier.create({
    data: { name: 'VIP', minSpend: 1000, discountPct: 20 }
  });
  
  await prisma.loyaltyTier.create({
    data: { name: 'Occasional', minSpend: 0, discountPct: 10 }
  });

  // Create Categories
  const cakes = await prisma.category.create({
    data: { name: 'Signature Cake Studio', order: 1 }
  });
  
  const fusion = await prisma.category.create({
    data: { name: 'Artisanal Fusion', order: 2 }
  });

  const cafe = await prisma.category.create({
    data: { name: 'Cafe & Gelato', order: 3 }
  });

  const boxes = await prisma.category.create({
    data: { name: 'Delish Delight Boxes', order: 4 }
  });

  // --- Signature Products (All 3000+ as requested) ---

  // 1. Signature Kunafa Cake
  await prisma.product.create({
    data: {
      name: 'Signature Kunafa Cake',
      description: 'A Middle Eastern-inspired signature fusion dessert with layers of crunch and cream.',
      basePrice: 3200,
      image: '/kunafa-cake.png',
      categoryId: cakes.id,
      variants: { create: [{ name: '500g', price: 3200 }, { name: '1kg', price: 5800 }] }
    }
  });

  // 2. Boutique Birthday Cake
  await prisma.product.create({
    data: {
      name: 'Boutique Birthday Cake',
      description: 'Personalized celebration cakes crafted by Chef Bhawna. Pink fondant roses, gold leaf, and dreamy frosting.',
      basePrice: 3500,
      image: '/birthday-cake.png',
      categoryId: cakes.id,
      variants: { create: [{ name: '500g', price: 3500 }, { name: '1kg', price: 6200 }, { name: '2kg', price: 11000 }] }
    }
  });

  // 3. Mango Charlotte
  await prisma.product.create({
    data: {
      name: 'Mango Charlotte',
      description: 'A premium, seasonal elegant fruit cake. Light, airy, and artistically finished.',
      basePrice: 3800,
      image: '/mango-charlotte.png',
      categoryId: cakes.id,
      variants: { create: [{ name: '500g', price: 3800 }, { name: '1kg', price: 6800 }] }
    }
  });

  // 4. Chilli Avocado Tartine
  await prisma.product.create({
    data: {
      name: 'Chilli Avocado Tartine',
      description: 'A fresh, flavorful open-faced sourdough sandwich with creamy avocado and chili flakes.',
      basePrice: 3100,
      image: '/avocado-tartine.png',
      categoryId: cafe.id,
      variants: { create: [{ name: 'Classic', price: 3100 }] }
    }
  });

  // 5. Paneer Tikka Croissant
  await prisma.product.create({
    data: {
      name: 'Paneer Tikka Croissant',
      description: 'A savory fusion highlight blending Indian spices with flaky French pastry techniques.',
      basePrice: 3050,
      image: '/paneer-croissant.png',
      categoryId: fusion.id,
      variants: { create: [{ name: 'Single', price: 3050 }] }
    }
  });

  // 6. Delish Delight Box
  await prisma.product.create({
    data: {
      name: 'Delish Delight Box',
      description: 'Our signature artisanal curated box containing cookies, brownies, and marble cake.',
      basePrice: 4500,
      image: '/hero.png',
      categoryId: boxes.id,
      variants: { create: [{ name: 'Standard', price: 4500 }, { name: 'Luxury', price: 7500 }] }
    }
  });

  console.log('Seed data updated with premium pricing successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
