import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";

const payloadSchema = z.object({
  email: z.string().trim().email()
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = payloadSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ ok: true, message: "If the account exists, a verification email was sent." });
    }

    if ((user as { emailVerified?: Date | null }).emailVerified) {
      return NextResponse.json({ ok: true, message: "Email is already verified." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

    await db.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken: token,
        emailVerificationExpires: expires
      } as never
    });

    const mail = await sendVerificationEmail(email, token, req.nextUrl.origin);
    if (!mail.ok) {
      return NextResponse.json(
        { ok: true, warning: mail.message, verifyUrl: mail.verifyUrl, message: "Verification link generated." },
        { status: 202 }
      );
    }

    return NextResponse.json({ ok: true, message: "Verification email sent." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected resend error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
