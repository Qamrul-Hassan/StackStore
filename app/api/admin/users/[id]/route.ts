import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guard";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminSession();
  if (!admin.ok) return admin.response;

  const adminId = admin.session.user.id;
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "User id is required." }, { status: 400 });
  }
  if (id === adminId) {
    return NextResponse.json({ error: "You cannot delete your own admin account." }, { status: 400 });
  }

  const target = await db.user.findUnique({
    where: { id },
    select: { id: true, role: true }
  });
  if (!target) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }
  if (target.role === "ADMIN") {
    return NextResponse.json({ error: "Admin users cannot be deleted from this action." }, { status: 400 });
  }

  await db.user.delete({ where: { id: target.id } });
  return NextResponse.json({ ok: true, id: target.id });
}
