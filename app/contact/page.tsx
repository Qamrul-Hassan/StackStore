 "use client";

import { useState } from "react";
import { Mail, PhoneCall } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message: messageText
        })
      });
      const payload = (await res.json()) as { error?: string; message?: string };

      if (!res.ok) {
        setError(payload.error ?? "Failed to send message.");
        return;
      }

      setMessage(payload.message ?? "Message sent successfully.");
      setName("");
      setEmail("");
      setPhone("");
      setMessageText("");
    } catch {
      setError("Network/server error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-300">
        Home / <span className="font-semibold text-white">Contact</span>
      </p>

      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <div className="glass-panel section-shell section-single-cart cart-left rounded-2xl p-8">
          <div className="space-y-3 border-b border-[#e5e7eb] pb-8">
            <p className="flex items-center gap-3 text-2xl font-semibold text-[#210E14]">
              <span className="icon-circle bg-[#F92D0A]">
                <PhoneCall className="size-4" />
              </span>
              Call To Us
            </p>
            <p className="text-zinc-700">We are available 24/7, 7 days a week.</p>
            <p className="text-zinc-700">Phone: +8801611112222</p>
          </div>

          <div className="space-y-3 pt-8">
            <p className="flex items-center gap-3 text-2xl font-semibold text-[#210E14]">
              <span className="icon-circle bg-[#F92D0A]">
                <Mail className="size-4" />
              </span>
              Write To US
            </p>
            <p className="text-zinc-700">Fill out our form and we will contact you within 24 hours.</p>
            <p className="text-zinc-700">Email: mdqamrul74@gmail.com</p>
            <p className="text-zinc-700">Support: mdqamrul74@gmail.com</p>
          </div>
        </div>

        <form className="glass-panel section-shell section-single-cart cart-right rounded-2xl p-8" onSubmit={onSubmit}>
          <div className="grid gap-4 md:grid-cols-3">
            <Input
              className="h-12 border-[#dce3ea] bg-white/90"
              placeholder="Your Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              className="h-12 border-[#dce3ea] bg-white/90"
              type="email"
              placeholder="Your Email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              className="h-12 border-[#dce3ea] bg-white/90"
              placeholder="Your Phone *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <textarea
            className="mt-4 min-h-[220px] w-full rounded border border-[#dce3ea] bg-white/90 p-3 text-[#210E14] outline-none focus:ring-2 focus:ring-[#F92D0A]"
            placeholder="Your Message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            required
          />
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          {message ? <p className="mt-3 text-sm text-emerald-700">{message}</p> : null}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="rounded-lg bg-gradient-to-r from-[#210E14] via-[#712825] to-[#F92D0A] px-10 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_-18px_rgba(249,45,10,0.92)] transition hover:brightness-110 disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
