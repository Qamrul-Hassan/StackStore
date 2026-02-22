import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  const userEmail = session?.user?.email;
  if (!userId || !userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "Session is stale. Please sign in again." }, { status: 401 });
  }

  const orders = await db.order.findMany({
    where: {
      customerEmail: {
        equals: userEmail,
        mode: "insensitive"
      }
    },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              slug: true,
              name: true,
              imageUrl: true
            }
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  return NextResponse.json({
    orders: orders.map((order) => ({
      id: order.id,
      status: order.status,
      paymentMethod: order.paymentMethod,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        product: {
          id: item.product.id,
          slug: item.product.slug,
          name: item.product.name,
          imageUrl: item.product.imageUrl
        }
      }))
    }))
  });
}
