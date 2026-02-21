import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guard";
import { toProductDTO } from "@/lib/serializers";

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin.ok) return admin.response;

  const [products, orders] = await Promise.all([
    db.product.findMany({ orderBy: { createdAt: "desc" } }),
    db.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 50
    })
  ]);

  return NextResponse.json({
    products: products.map(toProductDTO),
    orders: orders.map((order) => ({
      id: order.id,
      customerEmail: order.customerEmail,
      status: order.status,
      paymentMethod: order.paymentMethod,
      totalAmount: Number(order.totalAmount),
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        productName: item.product.name
      }))
    }))
  });
}

