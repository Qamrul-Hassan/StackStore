"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/cart-provider";
import { IMAGE_FALLBACK } from "@/lib/image-placeholder";

export default function CheckoutPage() {
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "cod">("cod");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const cart = useCart();
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerEmail,
        paymentMethod,
        items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      })
    });

    const payload = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setError(payload.error ?? "Checkout failed");
      return;
    }

    if (payload.checkoutUrl) {
      window.location.href = payload.checkoutUrl;
      return;
    }

    cart.clear();
    router.push(`/checkout/success?orderId=${payload.orderId}`);
  }

  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-300">
        Account / My Account / Product / View Cart / <span className="font-semibold text-white">CheckOut</span>
      </p>

      <form className="section-single-cart cart-left grid gap-10 lg:grid-cols-[1fr_0.9fr]" onSubmit={onSubmit}>
        <div className="glass-panel section-shell space-y-5 rounded-2xl border border-white/60 bg-white/70 p-6 backdrop-blur-xl md:p-8">
          <h1 className="text-4xl font-semibold text-[#210E14] md:text-5xl">Billing Details</h1>
          <Field label="First Name*" />
          <Field label="Company Name" />
          <Field label="Street Address*" />
          <Field label="Apartment, floor, etc. (optional)" />
          <Field label="Town/City*" />
          <Field label="Phone Number*" />
          <div className="space-y-2">
            <label htmlFor="customer-email" className="text-sm font-medium text-[#4b5563]">Email Address*</label>
            <Input
              id="customer-email"
              type="email"
              className="h-12 border-[#dce3ea] bg-white/90"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#210E14]">
            <input type="checkbox" className="size-4 accent-[#F92D0A]" defaultChecked />
            Save this information for faster check-out next time
          </label>
        </div>

        <div className="glass-panel section-shell space-y-5 rounded-2xl border border-white/60 bg-white/70 p-6 text-[#210E14] backdrop-blur-xl md:p-8">
          <h2 className="text-2xl font-semibold text-[#210E14]">Order Summary</h2>
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <CheckoutItemImage src={item.imageUrl} alt={item.name} />
                  <span className="truncate font-medium">{item.name}</span>
                </div>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-[#d4dbe5] pt-4">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <span>Subtotal:</span>
              <span className="font-medium">${cart.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <span>Shipping:</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>

          <fieldset className="space-y-3 pt-2">
            <legend className="sr-only">Select payment method</legend>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="radio"
                checked={paymentMethod === "stripe"}
                onChange={() => setPaymentMethod("stripe")}
              />
              Bank
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on delivery
            </label>
          </fieldset>

          <div className="flex gap-3 pt-1">
            <Input className="h-12 border-white/70 bg-white/80 backdrop-blur-md" placeholder="Coupon Code" />
            <Button
              type="button"
              className="h-12 bg-gradient-to-r from-[#210E14] via-[#712825] to-[#F92D0A] px-8 text-white normal-case tracking-normal transition hover:brightness-110"
            >
              Apply Coupon
            </Button>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button
            disabled={submitting}
            className="h-12 bg-gradient-to-r from-[#210E14] via-[#712825] to-[#F92D0A] px-10 text-white normal-case tracking-normal transition hover:brightness-110"
            type="submit"
          >
            {submitting ? "Placing order..." : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label }: { label: string }) {
  const fieldId = useId();

  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="text-sm font-medium text-[#4b5563]">{label}</label>
      <Input id={fieldId} className="h-12 border-[#dce3ea] bg-white/90" />
    </div>
  );
}

function CheckoutItemImage({ src, alt }: { src: string; alt: string }) {
  const [safeSrc, setSafeSrc] = useState(src || IMAGE_FALLBACK);

  return (
    <div className="relative size-12 shrink-0 overflow-hidden rounded border border-white/70 bg-white/75 shadow-sm">
      <Image
        src={safeSrc}
        alt={alt}
        fill
        unoptimized
        sizes="48px"
        className="object-cover"
        onError={() => {
          if (safeSrc !== IMAGE_FALLBACK) setSafeSrc(IMAGE_FALLBACK);
        }}
      />
    </div>
  );
}
