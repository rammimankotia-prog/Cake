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
  const vip = await prisma.loyaltyTier.create({
    data: { name: 'VIP', minSpend: 1000, discountPct: 20 }
  });
  
  const occasional = await prisma.loyaltyTier.create({
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

  // --- Signature Products ---

  // 1. Delish Delight Box
  await prisma.product.create({
    data: {
      name: 'Delish Delight Box',
      description: 'Our signature artisanal curated box containing cookies, brownies, and marble cake.',
      basePrice: 25.00,
      image: '/hero.png',
      categoryId: boxes.id,
      variants: { create: [{ name: 'Standard', price: 25.00 }, { name: 'Luxury', price: 45.00 }] }
    }
  });

  // 2. Chilli Avocado Tartine
  await prisma.product.create({
    data: {
      name: 'Chilli Avocado Tartine',
      description: 'A fresh, flavorful open-faced sourdough sandwich with creamy avocado and chili flakes.',
      basePrice: 12.50,
      image: '/hero.png',
      categoryId: cafe.id,
      variants: { create: [{ name: 'Classic', price: 12.50 }] }
    }
  });

  // 3. Paneer Tikka Croissant
  await prisma.product.create({
    data: {
      name: 'Paneer Tikka Croissant',
      description: 'A savory fusion highlight blending Indian spices with flaky French pastry techniques.',
      basePrice: 8.50,
      image: '/hero.png',
      categoryId: fusion.id,
      variants: { create: [{ name: 'Single', price: 8.50 }] }
    }
  });

  // 4. Kunafa Cake
  await prisma.product.create({
    data: {
      name: 'Signature Kunafa Cake',
      description: 'A Middle Eastern-inspired signature fusion dessert with layers of crunch and cream.',
      basePrice: 70.00,
      image: '/hero.png',
      categoryId: cakes.id,
      variants: { create: [{ name: '1kg', price: 70.00 }] }
    }
  });

  // 5. Mango Charlotte
  await prisma.product.create({
    data: {
      name: 'Mango Charlotte',
      description: 'A premium, seasonal elegant fruit cake. Light, airy, and artistically finished.',
      basePrice: 65.00,
      image: '/hero.png',
      categoryId: cakes.id,
      variants: { create: [{ name: '1kg', price: 65.00 }] }
    }
  });

  // 6. Banoffee Pie
  await prisma.product.create({
    data: {
      name: 'Studio Banoffee Pie',
      description: 'A studio-quality classic with rich layers of banana, toffee, and cream.',
      basePrice: 15.00,
      image: '/hero.png',
      categoryId: fusion.id,
      variants: { create: [{ name: 'Single Serving', price: 15.00 }] }
    }
  });

  // 7. Nutty Choco Slab
  await prisma.product.create({
    data: {
      name: 'Nutty Choco Slab',
      description: 'A decadent chocolate block loaded with various premium nuts.',
      basePrice: 18.00,
      image: '/hero.png',
      categoryId: boxes.id,
      variants: { create: [{ name: 'Standard Slab', price: 18.00 }] }
    }
  });

  // 8. Tropical Mojito
  await prisma.product.create({
    data: {
      name: 'Tropical Mojito',
      description: 'A refreshing signature cafe beverage with fresh mint and tropical flavors.',
      basePrice: 7.50,
      image: '/hero.png',
      categoryId: cafe.id,
      variants: { create: [{ name: 'Glass', price: 7.50 }] }
    }
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
