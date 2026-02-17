import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toProductDTO } from "@/lib/serializers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = await db.product.findFirst({ where: { slug, isActive: true } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(toProductDTO(product));
}
