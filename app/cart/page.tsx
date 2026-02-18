"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IMAGE_FALLBACK } from "@/lib/image-placeholder";

export default function CartPage() {
  const cart = useCart();

  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-500">Home / <span className="text-[#210E14]">Cart</span></p>

      <div className="glass-panel overflow-hidden rounded border border-[#e5e7eb]">
        <table className="w-full text-left">
          <thead className="border-b border-[#e5e7eb] text-sm">
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
                <td colSpan={5} className="px-6 py-10 text-center text-zinc-500">
                  Your cart is empty. Add products from the shop.
                </td>
              </tr>
            ) : (
              cart.items.map((item) => (
                <tr key={item.productId} className="border-b border-[#f1f1f1] text-[#210E14]">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="relative size-14 overflow-hidden rounded bg-[#f5f5f5]">
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

      <div className="flex flex-wrap justify-between gap-4">
        <Link href="/">
          <Button variant="outline" className="h-12 px-8 normal-case tracking-normal">Return To Shop</Button>
        </Link>
        <Button
          variant="outline"
          className="h-12 px-8 normal-case tracking-normal"
          onClick={() => {
            cart.items.forEach((item) => cart.updateQuantity(item.productId, Math.max(1, item.quantity)));
          }}
        >
          Update Cart
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="flex gap-3">
          <Input className="h-12" placeholder="Coupon Code" />
          <Button className="h-12 px-8 normal-case tracking-normal">Apply Coupon</Button>
        </div>

        <div className="rounded border border-[#210E14] bg-white p-6">
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
          <Link href="/checkout" className="mt-6 inline-block">
            <Button className="h-12 px-10 normal-case tracking-normal">Proceed to checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
