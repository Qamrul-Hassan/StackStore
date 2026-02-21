import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const payloadSchema = z.object({
  ids: z.array(z.string().min(1))
});

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await db.userWishlistItem.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" }
  });
  return NextResponse.json({ ids: items.map((item) => item.productId) });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json();
  const parsed = payloadSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid wishlist payload" }, { status: 400 });
  }

  const uniqueIds = Array.from(new Set(parsed.data.ids.map((id) => id.trim()).filter(Boolean)));

  await db.$transaction([
    db.userWishlistItem.deleteMany({ where: { userId } }),
    ...uniqueIds.map((productId) =>
      db.userWishlistItem.create({
        data: { userId, productId }
      })
    )
  ]);

  return NextResponse.json({ ok: true });
}

