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
