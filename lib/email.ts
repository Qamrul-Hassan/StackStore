import { absoluteUrl } from "@/lib/seo";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendVerificationEmail(email: string, token: string, baseUrl?: string) {
  const verifyPath = `/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  const verifyUrl = baseUrl ? `${baseUrl}${verifyPath}` : absoluteUrl(verifyPath);
  const from = process.env.EMAIL_FROM;
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey || !from) {
    return {
      ok: false as const,
      verifyUrl,
      message: "Email provider is not configured. Set RESEND_API_KEY and EMAIL_FROM."
    };
  }

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

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Verify your StackStore account",
      html
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    return {
      ok: false as const,
      verifyUrl,
      message: `Failed to send verification email: ${errorText}`
    };
  }

  return { ok: true as const, verifyUrl };
}
