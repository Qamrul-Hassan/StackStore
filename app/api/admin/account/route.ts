import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth-guard";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isStrongPassword(password: string) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin.ok) return admin.response;

  const userId = admin.session.user.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };

  const requestedEmail = String(body.email ?? "")
    .trim()
    .toLowerCase();
  const currentPassword = String(body.currentPassword ?? "");
  const newPassword = String(body.newPassword ?? "");
  const confirmPassword = String(body.confirmPassword ?? "");

  const currentUser = await db.user.findUnique({ where: { id: userId } });
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updateData: { email?: string; passwordHash?: string } = {};

  if (requestedEmail && requestedEmail !== currentUser.email) {
    if (!EMAIL_RE.test(requestedEmail)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email: requestedEmail } });
    if (existing && existing.id !== currentUser.id) {
      return NextResponse.json({ error: "Email is already in use." }, { status: 409 });
    }

    updateData.email = requestedEmail;
  }

  const wantsPasswordChange = Boolean(currentPassword || newPassword || confirmPassword);
  if (wantsPasswordChange) {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Fill current password, new password, and confirm password." },
        { status: 400 }
      );
    }

    const validCurrentPassword = await bcrypt.compare(currentPassword, currentUser.passwordHash);
    if (!validCurrentPassword) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirm password do not match." },
        { status: 400 }
      );
    }

    if (!isStrongPassword(newPassword)) {
      return NextResponse.json(
        {
          error:
            "Password must be 8+ chars and include uppercase, lowercase, number, and symbol."
        },
        { status: 400 }
      );
    }

    updateData.passwordHash = await bcrypt.hash(newPassword, 10);
  }

  if (!updateData.email && !updateData.passwordHash) {
    return NextResponse.json({ error: "No account changes provided." }, { status: 400 });
  }

  const updated = await db.user.update({
    where: { id: currentUser.id },
    data: updateData
  });

  return NextResponse.json({
    ok: true,
    email: updated.email,
    message: "Admin account updated successfully."
  });
}
