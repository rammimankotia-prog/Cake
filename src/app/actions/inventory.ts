"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(data: any) {
  const { name, category, description, basePrice, discountPct, weights, variantPrices, imagePreview } = data;

  let dbCategory = await prisma.category.findFirst({
    where: { name: category }
  });

  if (!dbCategory) {
    dbCategory = await prisma.category.create({
      data: { name: category, order: 0 }
    });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      basePrice,
      discountPct,
      image: imagePreview || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80",
      categoryId: dbCategory.id,
      stock: 15,
      weights: weights.join(", "),
      isActive: true,
      variants: {
        create: weights.map((w: string) => ({
          name: w,
          price: variantPrices[w] || basePrice
        }))
      }
    }
  });

  revalidatePath('/catalog');
  revalidatePath('/admin/categories');

  return { success: true, product };
}

export async function getProductAction(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: { 
      category: true,
      variants: true
    }
  });
}

export async function updateProductAction(id: string, data: any) {
  const { name, category, description, basePrice, discountPct, weights, variantPrices, imagePreview } = data;

  let dbCategory = await prisma.category.findFirst({
    where: { name: category }
  });

  if (!dbCategory) {
    dbCategory = await prisma.category.create({
      data: { name: category, order: 0 }
    });
  }

  // Update product basic info
  await prisma.product.update({
    where: { id },
    data: {
      name,
      description,
      basePrice,
      discountPct,
      categoryId: dbCategory.id,
      weights: weights.join(", "),
      image: imagePreview || undefined // Only update if new image provided
    }
  });

  // Handle variants: easiest is to delete and recreate or sync
  await prisma.variant.deleteMany({
    where: { productId: id }
  });

  await prisma.variant.createMany({
    data: weights.map((w: string) => ({
      name: w,
      price: variantPrices[w] || basePrice,
      productId: id
    }))
  });

  revalidatePath('/catalog');
  revalidatePath('/admin/categories');

  return { success: true };
}
