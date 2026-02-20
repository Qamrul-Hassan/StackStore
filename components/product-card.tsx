"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, Trash2 } from "lucide-react";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { useWishlist } from "@/components/wishlist-provider";
import { IMAGE_FALLBACK } from "@/lib/image-placeholder";
import { animateFlyToTarget, animateRemoveFromTarget } from "@/lib/fly-to-target";

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
  const hydrated = React.useSyncExternalStore(() => () => {}, () => true, () => false);
  const productId = String(product.id);
  const wishlistKey = String(product.slug || product.id);
  const shouldEagerLoad =
    productId === "1" || wishlistKey === "havit-hv-g92-gamepad" || wishlistKey === "dj-1";
  const inWishlist = hydrated && (wishlist.has(wishlistKey) || wishlist.has(productId));
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null);
  const cardImage = product.images?.[0] ?? product.imageUrl;
  const [imageSrc, setImageSrc] = React.useState(cardImage);

  React.useEffect(() => {
    setImageSrc(cardImage);
  }, [cardImage]);

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
    <div className="group animate-fade-up rounded-2xl border border-white/20 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-2 shadow-[0_24px_36px_-28px_rgba(0,0,0,0.65)] transition duration-300 hover:-translate-y-1">
      <div className="relative overflow-hidden rounded-xl border border-white/60 bg-[linear-gradient(160deg,rgba(255,255,255,0.96)_0%,rgba(236,242,249,0.94)_55%,rgba(226,232,240,0.9)_100%)] p-3 transition-all duration-300 group-hover:border-[#FB8500]/65 group-hover:shadow-[0_30px_36px_-24px_rgba(33,14,20,0.75)] sm:p-3.5">
        <div className="pointer-events-none absolute inset-x-2 top-0 h-20 rounded-b-[26px] bg-[radial-gradient(circle_at_top,rgba(251,133,0,0.25),rgba(251,133,0,0)_72%)]" />
        {product.badge ? (
          <span className="absolute left-3 top-3 z-20 rounded-md border border-white/55 bg-[linear-gradient(105deg,#F92D0A_0%,#FB8500_100%)] px-2.5 py-1 text-xs font-bold leading-none text-white shadow-[0_12px_20px_-12px_rgba(249,45,10,0.95)]">
            {product.badge}
          </span>
        ) : null}
        <div className="absolute right-3 top-3 z-20 space-y-1">
          {product.removable ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                animateRemoveFromTarget('[data-fly-target="wishlist"]', {
                  color: "#F92D0A",
                  size: 13,
                  kind: "heart"
                });
                product.onRemove?.(wishlistKey);
              }}
              className="grid size-8 place-items-center rounded-full border border-white bg-white/95 text-[#F92D0A] shadow-[0_10px_16px_-12px_rgba(33,14,20,0.9)] transition hover:scale-105 hover:border-[#F92D0A]/55"
              aria-label="Remove from wishlist"
            >
              <Trash2 className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (inWishlist) {
                  wishlist.remove(wishlistKey);
                  wishlist.remove(productId);
                  animateRemoveFromTarget('[data-fly-target="wishlist"]', {
                    color: "#F92D0A",
                    size: 13,
                    kind: "heart"
                  });
                } else {
                  wishlist.add(wishlistKey);
                }
                if (!inWishlist) {
                  animateFlyToTarget(e.currentTarget, '[data-fly-target="wishlist"]', {
                    color: "#F92D0A",
                    size: 13,
                    kind: "heart"
                  });
                }
              }}
              aria-pressed={inWishlist}
              className={`grid size-8 place-items-center rounded-full shadow transition hover:scale-105 ${
                inWishlist
                  ? "border border-[#F92D0A]/45 bg-[#F92D0A] text-white ring-2 ring-[#F92D0A]/35"
                  : "border border-white bg-white/95 text-[#210E14]"
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart className={`size-4 ${inWishlist ? "fill-current" : ""}`} />
            </button>
          )}
          <Link
            href={`/products/${product.slug}`}
            className="grid size-7 place-items-center rounded-full border border-white bg-white/95 text-[#210E14] shadow-[0_10px_16px_-12px_rgba(33,14,20,0.9)] transition hover:border-[#FB8500] hover:bg-gradient-to-r hover:from-[#FB8500] hover:to-[#F92D0A] hover:text-white"
          >
            <Eye className="size-4" />
          </Link>
        </div>
        <Link href={`/products/${product.slug}`} className="block">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.75),rgba(241,245,249,0.82))] shadow-[inset_0_-10px_22px_-18px_rgba(40,50,63,0.5)]">
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              unoptimized
              loading={shouldEagerLoad ? "eager" : "lazy"}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 42vw, 24vw"
              className="object-contain p-2 transition duration-500 group-hover:scale-110"
              onError={() => {
                if (imageSrc !== IMAGE_FALLBACK) setImageSrc(IMAGE_FALLBACK);
              }}
            />
          </div>
        </Link>
        {product.colors && product.colors.length > 0 ? (
          <div className="mt-3 flex items-center gap-1.5">
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
                className={`size-3.5 rounded-full border border-white/70 shadow-[0_1px_4px_rgba(0,0,0,0.2)] transition hover:scale-110 ${selectedColor === c ? "ring-2 ring-[#FB8500] ring-offset-1" : ""}`}
                style={{ background: c }}
              />
            ))}
          </div>
        ) : null}
        <div className="mt-3">
          <AddToCartButton
            className="h-10 w-full rounded-lg bg-[linear-gradient(105deg,#210E14_0%,#712825_40%,#F92D0A_78%,#FB8500_100%)] text-sm font-semibold normal-case tracking-normal text-white shadow-[0_16px_24px_-14px_rgba(249,45,10,0.85)] transition duration-300 hover:brightness-110 hover:shadow-[0_22px_32px_-16px_rgba(249,45,10,0.9)]"
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
      <div className="mt-2.5 rounded-xl border border-white/15 bg-[linear-gradient(170deg,rgba(40,50,63,0.78),rgba(33,14,20,0.82))] px-3 py-3">
        <h3 className="line-clamp-1 text-[0.98rem] font-semibold leading-tight text-white sm:text-[1.06rem]">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-end gap-3">
          <span className="text-[1.04rem] font-bold text-[#FF6A33] sm:text-[1.2rem]">${product.price}</span>
          {product.oldPrice ? <span className="text-xs text-zinc-300/80 line-through sm:text-sm">${product.oldPrice}</span> : null}
        </div>
        {product.rating ? (
          <div className="mt-1.5 flex items-center gap-2 text-[0.8rem] text-zinc-200/85 sm:text-[0.88rem]">
            <span className="text-[#FB8500]">★★★★★</span>
            <span>({product.reviews ?? 0})</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
