import { absoluteUrl } from "@/lib/seo";
import nodemailer from "nodemailer";

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
  const smtpHost = process.env.SMTP_HOST;
  const smtpPortRaw = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === "true";

  if (from && smtpHost && smtpPortRaw && smtpUser && smtpPass) {
    const smtpPort = Number(smtpPortRaw);
    if (Number.isNaN(smtpPort) || smtpPort <= 0) {
      return {
        ok: false as const,
        message: "Invalid SMTP_PORT. It must be a valid number."
      };
    }
    return {
      ok: true as const,
      provider: "smtp" as const,
      from,
      smtpHost,
      smtpPort,
      smtpUser,
      smtpPass,
      smtpSecure
    };
  }

  if (from && resendKey) {
    return {
      ok: true as const,
      provider: "resend" as const,
      from,
      resendKey
    };
  }

  if (!from) {
    return {
      ok: false as const,
      message: "Email provider is not configured. Set EMAIL_FROM."
    };
  }

  return {
    ok: false as const,
    message:
      "Email provider is not configured. Use SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS (recommended for Gmail) or RESEND_API_KEY."
  };
}

async function sendMail(input: SendMailInput): Promise<MailResult> {
  const config = getMailConfig();
  if (!config.ok) {
    return { ok: false, message: config.message };
  }

  const to = Array.isArray(input.to) ? input.to : [input.to];
  if (config.provider === "smtp") {
    try {
      const transport = nodemailer.createTransport({
        host: config.smtpHost,
        port: config.smtpPort,
        secure: config.smtpSecure || config.smtpPort === 465,
        auth: {
          user: config.smtpUser,
          pass: config.smtpPass
        }
      });

      await transport.sendMail({
        from: config.from,
        to: to.join(", "),
        subject: input.subject,
        html: input.html,
        replyTo: input.replyTo
      });
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: `Failed to send email via SMTP: ${error instanceof Error ? error.message : "Unknown SMTP error"}`
      };
    }
  }

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

  const ownerMail = await sendMail({
    to: input.toOwnerEmail,
    subject: `New contact message from ${input.name}`,
    html: ownerHtml,
    replyTo: input.email
  });

  if (!ownerMail.ok) {
    return { ok: false as const, message: ownerMail.message };
  }

  const customerMail = await sendMail({
    to: input.email,
    subject: "We received your message - StackStore",
    html: customerHtml
  });

  if (!customerMail.ok) {
    return {
      ok: true as const,
      customerReplySent: false as const,
      warning: customerMail.message
    };
  }

  return { ok: true as const, customerReplySent: true as const };
}
