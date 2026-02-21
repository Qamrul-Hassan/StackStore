import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const accountUrl = `${req.nextUrl.origin}/account`;
  const token = req.nextUrl.searchParams.get("token")?.trim();
  if (!token) {
    return NextResponse.redirect(`${accountUrl}?verified=0`);
  }

  const user = await db.user.findFirst({
    where: { emailVerificationToken: token } as never
  });
  if (!user) {
    return NextResponse.redirect(`${accountUrl}?verified=0`);
  }

  const verificationExpires = (user as { emailVerificationExpires?: Date | null }).emailVerificationExpires;
  if (!verificationExpires || verificationExpires < new Date()) {
    return NextResponse.redirect(`${accountUrl}?verified=expired`);
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      emailVerificationToken: null,
      emailVerificationExpires: null
    } as never
  });

  return NextResponse.redirect(`${accountUrl}?verified=1`);
}
