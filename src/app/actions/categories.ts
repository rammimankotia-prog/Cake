"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          variants: true
        }
      }
    },
    orderBy: {
      order: 'asc'
    }
  });

  return categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: "🎂", // Fallback, could add to schema later
    color: "bg-rose/10 text-rose",
    visible: true,
    products: cat.products.map(p => ({
      id: p.id,
      name: p.name,
      price: p.basePrice,
      weight: p.weights || "Custom",
      badge: p.discountPct > 0 ? "Sale" : "",
      active: p.isActive,
      stock: p.stock
    }))
  }));
}

export async function deleteCategoryAction(id: string) {
  await prisma.product.deleteMany({ where: { categoryId: id } });
  await prisma.category.delete({ where: { id } });
  revalidatePath('/catalog');
  revalidatePath('/admin/categories');
}

export async function deleteProductAction(id: string) {
  await prisma.variant.deleteMany({ where: { productId: id } });
  await prisma.orderItem.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });
  revalidatePath('/catalog');
  revalidatePath('/admin/categories');
}

export async function updateCategoryNameAction(id: string, name: string) {
  await prisma.category.update({ where: { id }, data: { name } });
  revalidatePath('/catalog');
  revalidatePath('/admin/categories');
}

export async function createCategoryAction(name: string, icon: string) {
  await prisma.category.create({ data: { name, order: 0 } });
  revalidatePath('/catalog');
  revalidatePath('/admin/categories');
}

export async function toggleProductActiveAction(id: string, active: boolean) {
  await prisma.product.update({ where: { id }, data: { isActive: active } });
  revalidatePath('/catalog');
  revalidatePath('/admin/categories');
}
