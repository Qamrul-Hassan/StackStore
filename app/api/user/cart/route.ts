import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  imageUrl: z.string().min(1),
  quantity: z.number().int().positive()
});

const payloadSchema = z.object({
  items: z.array(cartItemSchema)
});

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "Session is stale. Please sign in again." }, { status: 401 });
  }

  const items = await db.userCartItem.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" }
  });

  return NextResponse.json({
    items: items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: Number(item.price),
      imageUrl: item.imageUrl,
      quantity: item.quantity
    }))
  });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "Session is stale. Please sign in again." }, { status: 401 });
  }

  const json = await req.json();
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid cart payload" }, { status: 400 });
  }

  try {
    await db.$transaction([
      db.userCartItem.deleteMany({ where: { userId } }),
      ...parsed.data.items.map((item) =>
        db.userCartItem.create({
          data: {
            userId,
            productId: item.productId,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            quantity: item.quantity
          }
        })
      )
    ]);
  } catch {
    return NextResponse.json({ error: "Failed to save cart. Please re-login." }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
