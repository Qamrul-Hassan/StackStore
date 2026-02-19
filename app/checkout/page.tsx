"use client";

import { useState } from "react";
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
      <p className="text-sm text-zinc-500">
        Account / My Account / Product / View Cart / <span className="text-[#210E14]">CheckOut</span>
      </p>

      <form className="section-single-cart cart-left grid gap-10 lg:grid-cols-[1fr_0.9fr]" onSubmit={onSubmit}>
        <div className="space-y-5">
          <h1 className="text-5xl font-semibold text-[#210E14]">Billing Details</h1>
          <Field label="First Name*" />
          <Field label="Company Name" />
          <Field label="Street Address*" />
          <Field label="Apartment, floor, etc. (optional)" />
          <Field label="Town/City*" />
          <Field label="Phone Number*" />
          <div className="space-y-2">
            <label className="text-sm text-zinc-500">Email Address*</label>
            <Input
              type="email"
              className="h-12 bg-[#f5f5f5]"
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

        <div className="space-y-5 text-[#210E14]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 overflow-hidden rounded bg-[#f5f5f5]">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = IMAGE_FALLBACK;
                      }}
                    />
                  </div>
                  <span>{item.name}</span>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-[#e5e7eb] pt-4">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <span>Subtotal:</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total:</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "stripe"}
                onChange={() => setPaymentMethod("stripe")}
              />
              Bank
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
              />
              Cash on delivery
            </label>
          </div>

          <div className="flex gap-3 pt-1">
            <Input className="h-12" placeholder="Coupon Code" />
            <Button type="button" className="h-12 px-8 normal-case tracking-normal">Apply Coupon</Button>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button disabled={submitting} className="h-12 px-10 normal-case tracking-normal" type="submit">
            {submitting ? "Placing order..." : "Place Order"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function Field({ label }: { label: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-zinc-500">{label}</label>
      <Input className="h-12 bg-[#f5f5f5]" />
    </div>
  );
}
