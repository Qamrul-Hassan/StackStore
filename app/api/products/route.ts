import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { toProductDTO } from "@/lib/serializers";

export async function GET() {
  const products = await db.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(products.map(toProductDTO));
}
