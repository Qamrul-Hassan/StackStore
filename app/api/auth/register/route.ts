import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/email";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
  confirmPassword: z.string().min(8).max(128)
});

function getPasswordValidation(password: string) {
  return {
    minLength: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password)
  };
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid signup data." }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase();
    if (parsed.data.password !== parsed.data.confirmPassword) {
      return NextResponse.json({ error: "Password and confirm password must match." }, { status: 400 });
    }

    const checks = getPasswordValidation(parsed.data.password);
    if (Object.values(checks).some((v) => !v)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 chars and include uppercase, lowercase, number, and special character."
        },
        { status: 400 }
      );
    }

    const exists = await db.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await db.user.create({
      data: {
        name: parsed.data.name,
        email,
        passwordHash,
        emailVerificationToken: token,
        emailVerificationExpires: expires,
        role: "CUSTOMER"
      } as never
    });

    const mail = await sendVerificationEmail(email, token, req.nextUrl.origin);
    if (!mail.ok) {
      return NextResponse.json(
        {
          ok: true,
          warning: mail.message,
          verifyUrl: mail.verifyUrl
        },
        { status: 202 }
      );
    }

    return NextResponse.json({ ok: true, message: "Verification email sent." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected signup error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
