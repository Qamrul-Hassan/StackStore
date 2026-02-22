import { absoluteUrl } from "@/lib/seo";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type MailResult =
  | { ok: true }
  | { ok: false; message: string };

type SendMailInput = {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
};

function getMailConfig() {
  const from = process.env.EMAIL_FROM;
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey || !from) {
    return {
      ok: false as const,
      message: "Email provider is not configured. Set RESEND_API_KEY and EMAIL_FROM."
    };
  }
  return { ok: true as const, from, resendKey };
}

async function sendMail(input: SendMailInput): Promise<MailResult> {
  const config = getMailConfig();
  if (!config.ok) {
    return { ok: false, message: config.message };
  }

  const to = Array.isArray(input.to) ? input.to : [input.to];
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.resendKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: config.from,
      to,
      subject: input.subject,
      html: input.html,
      reply_to: input.replyTo
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    return {
      ok: false,
      message: `Failed to send email: ${errorText}`
    };
  }

  return { ok: true };
}

export async function sendVerificationEmail(email: string, token: string, baseUrl?: string) {
  const verifyPath = `/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  const verifyUrl = baseUrl ? `${baseUrl}${verifyPath}` : absoluteUrl(verifyPath);

  const html = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111827;">
      <h2 style="margin:0 0 12px;">Verify your StackStore account</h2>
      <p style="margin:0 0 14px;">Click the button below to verify your email:</p>
      <p style="margin:0 0 18px;">
        <a href="${escapeHtml(verifyUrl)}" style="background:#F92D0A;color:#ffffff;text-decoration:none;padding:10px 16px;border-radius:8px;display:inline-block;">
          Verify Email
        </a>
      </p>
      <p style="margin:0 0 8px;">If the button does not work, open this link:</p>
      <p style="margin:0;"><a href="${escapeHtml(verifyUrl)}">${escapeHtml(verifyUrl)}</a></p>
    </div>
  `;

  const sent = await sendMail({
    to: email,
    subject: "Verify your StackStore account",
    html
  });
  if (!sent.ok) {
    return {
      ok: false as const,
      verifyUrl,
      message: `Failed to send verification email: ${sent.message}`
    };
  }

  return { ok: true as const, verifyUrl };
}

export async function sendContactEmails(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
  toOwnerEmail: string;
}) {
  const ownerHtml = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111827;">
      <h2 style="margin:0 0 12px;">New Contact Message</h2>
      <p style="margin:0 0 8px;"><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p style="margin:0 0 8px;"><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      <p style="margin:0 0 8px;"><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>
      <p style="margin:0 0 8px;"><strong>Message:</strong></p>
      <p style="margin:0; white-space:pre-wrap;">${escapeHtml(input.message)}</p>
    </div>
  `;

  const customerHtml = `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111827;">
      <h2 style="margin:0 0 12px;">We received your message</h2>
      <p style="margin:0 0 14px;">Hi ${escapeHtml(input.name)}, thanks for contacting StackStore.</p>
      <p style="margin:0 0 14px;">Our team will reply within 24 hours.</p>
      <div style="padding:10px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px;">
        <p style="margin:0 0 8px;"><strong>Your message:</strong></p>
        <p style="margin:0; white-space:pre-wrap;">${escapeHtml(input.message)}</p>
      </div>
      <p style="margin:14px 0 0;">Regards,<br/>StackStore Team</p>
    </div>
  `;

  const [ownerMail, customerMail] = await Promise.all([
    sendMail({
      to: input.toOwnerEmail,
      subject: `New contact message from ${input.name}`,
      html: ownerHtml,
      replyTo: input.email
    }),
    sendMail({
      to: input.email,
      subject: "We received your message - StackStore",
      html: customerHtml
    })
  ]);

  if (!ownerMail.ok) {
    return { ok: false as const, message: ownerMail.message };
  }
  if (!customerMail.ok) {
    return { ok: false as const, message: customerMail.message };
  }
  return { ok: true as const };
}
