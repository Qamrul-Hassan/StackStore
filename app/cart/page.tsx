"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IMAGE_FALLBACK } from "@/lib/image-placeholder";

export default function CartPage() {
  const cart = useCart();

  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-300">
        Home / <span className="font-semibold text-white">Cart</span>
      </p>

      <div className="glass-panel section-shell section-single-cart cart-left overflow-hidden rounded-2xl">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[720px] text-left">
            <thead className="border-b border-[#d4dbe5] text-sm">
              <tr className="text-[#210E14]">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Quantity</th>
                <th className="px-6 py-4 text-right">Subtotal</th>
                <th className="px-6 py-4 text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-zinc-600">
                    Your cart is empty. Add products from the shop.
                  </td>
                </tr>
              ) : (
                cart.items.map((item) => (
                  <tr key={item.productId} className="border-b border-[#e7edf4] text-[#210E14]">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <CartItemImage src={item.imageUrl} alt={item.name} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-medium">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-5">
                      <Input
                        type="number"
                        min={1}
                        className="w-24"
                        value={item.quantity}
                        onChange={(e) => cart.updateQuantity(item.productId, Number(e.target.value || 1))}
                      />
                    </td>
                    <td className="px-6 py-5 text-right font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => cart.removeItem(item.productId)}
                        className="inline-flex items-center justify-center rounded border border-[#e5e7eb] bg-white p-2 transition hover:border-[#F92D0A] hover:bg-[#F92D0A] hover:text-white"
                        aria-label="Remove item"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-[#e7edf4] md:hidden">
          {cart.items.length === 0 ? (
            <div className="px-5 py-10 text-center text-zinc-600">Your cart is empty. Add products from the shop.</div>
          ) : (
            cart.items.map((item) => (
              <div key={item.productId} className="space-y-3 px-4 py-4 text-[#210E14]">
                <div className="flex items-start gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <CartItemImage src={item.imageUrl} alt={item.name} />
                    <div className="min-w-0">
                      <p className="truncate text-lg font-medium leading-tight">{item.name}</p>
                      <p className="text-sm text-zinc-600">Price: ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-[1fr_1fr_auto] items-end gap-2">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#712825]">Quantity</p>
                    <div className="flex h-10 items-center overflow-hidden rounded-md border border-[#dce3ea] bg-white/85">
                      <button
                        type="button"
                        className="grid h-full w-9 place-items-center border-r border-[#dce3ea] text-lg font-semibold text-[#210E14] transition hover:bg-[#F4F6FA]"
                        onClick={() => cart.updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="grid h-full min-w-[34px] flex-1 place-items-center px-2 text-sm font-semibold text-[#210E14]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        className="grid h-full w-9 place-items-center border-l border-[#dce3ea] text-lg font-semibold text-[#210E14] transition hover:bg-[#F4F6FA]"
                        onClick={() => cart.updateQuantity(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#712825]">Subtotal</p>
                    <p className="rounded-md border border-[#dce3ea] bg-white/85 px-3 py-2 text-base font-semibold leading-6">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => cart.removeItem(item.productId)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded border border-[#e5e7eb] bg-white transition hover:border-[#F92D0A] hover:bg-[#F92D0A] hover:text-white"
                    aria-label="Remove item"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-between">
        <Link href="/">
          <Button variant="outline" className="h-12 w-full border-white/50 bg-white/10 px-8 text-white backdrop-blur-sm normal-case tracking-normal hover:bg-white/20 sm:w-auto">
            Return To Shop
          </Button>
        </Link>
        <Button
          variant="outline"
          className="h-12 w-full border-white/50 bg-white/10 px-8 text-white backdrop-blur-sm normal-case tracking-normal hover:bg-white/20 sm:w-auto"
          onClick={() => {
            cart.items.forEach((item) => cart.updateQuantity(item.productId, Math.max(1, item.quantity)));
          }}
        >
          Update Cart
        </Button>
      </div>

      <div className="section-single-cart cart-right grid gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input className="h-12 border-white/50 bg-white/80" placeholder="Coupon Code" />
          <Button className="h-12 bg-gradient-to-r from-[#210E14] via-[#712825] to-[#F92D0A] px-8 text-white normal-case tracking-normal">
            Apply Coupon
          </Button>
        </div>

        <div className="glass-panel section-shell rounded-2xl p-6">
          <h3 className="text-2xl font-semibold text-[#210E14]">Cart Total</h3>
          <div className="mt-4 space-y-4 text-[#210E14]">
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <span>Subtotal:</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-3">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
          </div>
          <Link href="/checkout" className="mt-6 inline-block w-full sm:w-auto">
            <Button className="h-12 w-full bg-gradient-to-r from-[#210E14] via-[#712825] to-[#F92D0A] px-10 text-white normal-case tracking-normal sm:w-auto">
              Proceed to checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function CartItemImage({ src, alt }: { src: string; alt: string }) {
  const [safeSrc, setSafeSrc] = useState(src || IMAGE_FALLBACK);

  return (
    <div className="relative size-14 overflow-hidden rounded border border-white/70 bg-white/80">
      <Image
        src={safeSrc}
        alt={alt}
        fill
        unoptimized
        sizes="56px"
        className="object-cover"
        onError={() => {
          if (safeSrc !== IMAGE_FALLBACK) setSafeSrc(IMAGE_FALLBACK);
        }}
      />
    </div>
  );
}
