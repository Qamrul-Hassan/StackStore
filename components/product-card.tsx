"use client";

import React from "react";
import Link from "next/link";
import { Eye, Heart, Trash2 } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { useWishlist } from "@/components/wishlist-provider";
import { IMAGE_FALLBACK } from "@/lib/image-placeholder";

type ProductCardType = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  images?: string[];
  colors?: string[];
  price: number;
  oldPrice?: number;
  rating?: number;
  reviews?: number;
  badge?: string;
  removable?: boolean;
  onRemove?: (id: string) => void;
};

export function ProductCard({ product }: { product: ProductCardType }) {
  const wishlist = useWishlist();
  const inWishlist = wishlist.has(product.id);
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const cardImage = product.images?.[0] ?? product.imageUrl;

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(`product_selection_${product.slug}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.color) setSelectedColor(parsed.color);
      }
    } catch {}
  }, [product.slug]);

  return (
    <div className="group space-y-2 animate-fade-up">
      <div className="relative overflow-hidden rounded-lg border border-[#dce3ea] bg-[linear-gradient(180deg,#f8fafc_0%,#edf2f7_100%)] p-3 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[#FB8500]/45 group-hover:shadow-[0_18px_34px_-22px_rgba(33,14,20,0.6)]">
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded bg-[#F92D0A] px-2 py-1 text-xs font-semibold text-white">
            {product.badge}
          </span>
        ) : null}
        <div className="absolute right-3 top-3 space-y-1">
          {product.removable ? (
            <button
              onClick={() => product.onRemove?.(product.id)}
              className="grid size-8 place-items-center rounded-full bg-white text-[#F92D0A] shadow transition hover:scale-105"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="size-4" />
            </button>
          ) : (
            <button
              onClick={() => wishlist.toggle(product.id)}
              className={`grid size-8 place-items-center rounded-full shadow transition hover:scale-105 ${
                inWishlist ? "bg-[#F92D0A] text-white" : "bg-white text-[#210E14]"
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart className="size-4" />
            </button>
          )}
          <Link
            href={`/products/${product.slug}`}
            className="grid size-7 place-items-center rounded-full bg-white text-[#210E14] shadow transition hover:bg-gradient-to-r hover:from-[#FB8500] hover:to-[#F92D0A] hover:text-white"
          >
            <Eye className="size-4" />
          </Link>
        </div>
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
            <img
              src={cardImage}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = IMAGE_FALLBACK;
              }}
            />
          </div>
        </Link>
        {product.colors && product.colors.length > 0 ? (
          <div className="mt-3 flex items-center gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                aria-label={`Select color ${c}`}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(c);
                  try {
                    localStorage.setItem(
                      `product_selection_${product.slug}`,
                      JSON.stringify({ color: c })
                    );
                    // small feedback by toggling a class
                    (e.currentTarget as HTMLButtonElement).classList.add("ring-2");
                    setTimeout(() => (e.currentTarget as HTMLButtonElement).classList.remove("ring-2"), 300);
                  } catch {}
                }}
                className={`size-4 rounded-full border ${selectedColor === c ? "ring-2 ring-[#FB8500]" : ""}`}
                style={{ background: c }}
              />
            ))}
          </div>
        ) : null}
        <div className="mt-3">
          <AddToCartButton
            className="h-10 w-full rounded bg-gradient-to-r from-[#210E14] via-[#712825] to-[#F92D0A] text-sm font-semibold normal-case tracking-normal text-white transition duration-300 hover:brightness-110 hover:shadow-[0_12px_24px_-12px_rgba(249,45,10,0.8)]"
            withIcon
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl
            }}
          />
        </div>
      </div>
      <h3 className="line-clamp-1 text-[1.34rem] font-semibold leading-tight text-[#210E14]">{product.name}</h3>
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold text-[#F92D0A]">${product.price}</span>
        {product.oldPrice ? <span className="text-zinc-400 line-through">${product.oldPrice}</span> : null}
      </div>
      {product.rating ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="text-[#FB8500]">★★★★★</span>
          <span>({product.reviews ?? 0})</span>
        </div>
      ) : null}
    </div>
  );
}
