import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/schemas";
import { sendContactEmails } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = contactSchema.safeParse(json);
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      const field = firstIssue?.path?.[0];
      const detail = firstIssue?.message ?? "Invalid input.";
      const fieldLabel = typeof field === "string" ? field : "form";
      return NextResponse.json(
        { error: `Invalid ${fieldLabel}: ${detail}` },
        { status: 400 }
      );
    }

    const ownerEmail =
      process.env.CONTACT_RECEIVER_EMAIL ||
      process.env.ADMIN_EMAIL ||
      "mdqamrul74@gmail.com";

    const sent = await sendContactEmails({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      message: parsed.data.message,
      toOwnerEmail: ownerEmail
    });

    if (!sent.ok) {
      const isProd = process.env.NODE_ENV === "production";
      return NextResponse.json(
        {
          error: isProd
            ? "Could not send emails right now. Please try again later."
            : `Could not send emails. ${sent.message}`
        },
        { status: 500 }
      );
    }

    if (!sent.customerReplySent) {
      const isProd = process.env.NODE_ENV === "production";
      return NextResponse.json({
        ok: true,
        message: isProd
          ? "Message sent successfully. Our team received your message."
          : `Message sent successfully. Owner notified, but customer auto-reply failed: ${sent.warning ?? "unknown reason"}`
      });
    }

    return NextResponse.json({ ok: true, message: "Message sent successfully. We emailed you a confirmation." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
