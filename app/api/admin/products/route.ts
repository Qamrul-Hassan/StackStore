import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guard";
import { productInputSchema } from "@/lib/schemas";
import { toProductDTO } from "@/lib/serializers";

export async function POST(req: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin.ok) return admin.response;

  const json = await req.json();
  const parsed = productInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await db.product.create({
    data: {
      ...parsed.data,
      price: parsed.data.price
    }
  });

  return NextResponse.json(toProductDTO(product), { status: 201 });
}
