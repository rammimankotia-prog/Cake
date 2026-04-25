"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      items: {
        include: { product: true }
      }
    }
  });

  return orders.map(o => ({
    id: o.id,
    customer: o.user.name || o.user.email || "Guest",
    items: o.items.map(i => `${i.product.name} x${i.quantity}`).join(", "),
    total: o.total * 85, // Adjusting scale if needed
    status: o.status,
    date: o.createdAt.toISOString().split('T')[0]
  }));
}

export async function updateOrderStatus(orderId: string, status: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}

export async function createOrder(data: {
  customerName: string;
  phone: string;
  total: number;
  items: { id: string; quantity: number }[];
}) {
  // Mock finding or creating a guest user
  let user = await prisma.user.findFirst({
    where: { name: data.customerName }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: data.customerName,
        email: `${data.customerName.replace(/\s+/g, '').toLowerCase()}${Date.now()}@guest.com`,
        password: "guest",
      }
    });
  }

  const order = await prisma.order.create({
    data: {
      userId: user.id,
      total: data.total / 85, // convert back to base price for DB if needed, but let's just save the number
      status: "PENDING",
      items: {
        create: data.items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: 0 // Mock price, or could fetch from DB
        }))
      }
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  return order;
}
