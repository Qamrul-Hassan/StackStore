import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guard";

const orderUpdateSchema = z.object({
  status: z.enum(["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED", "FAILED", "CANCELLED"])
});

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin.ok) return admin.response;

  const { id } = await context.params;
  const json = await req.json();
  const parsed = orderUpdateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const order = await db.order.update({
    where: { id },
    data: { status: parsed.data.status }
  });

  return NextResponse.json({
    id: order.id,
    status: order.status
  });
}
