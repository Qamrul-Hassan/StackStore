"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Heart, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { animateFlyToTarget } from "@/lib/fly-to-target";

type OptionGroup = { label: string; options: string[] };

type Props = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  description: string;
  reviews: number;
  gallery: string[];
  optionGroups: OptionGroup[];
};

const COLORS = ["#FB8500", "#F92D0A", "#712825", "#210E14", "#28323F"];

export function ProductDetailsInteractive({
  product,
  description,
  reviews,
  gallery,
  optionGroups
}: Props) {
  const cart = useCart();
  const wishlist = useWishlist();
  const hydrated = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        optionGroups.map((group) => [group.label, group.options[0] ?? ""])
      )
  );

  const activeImage = gallery[selectedImage] ?? product.imageUrl;
  const inWishlist = hydrated && wishlist.has(product.id);

  const detailSummary = useMemo(
    () => Object.entries(selectedOptions).map(([label, value]) => `${label}: ${value}`),
    [selectedOptions]
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[92px_minmax(0,1fr)_minmax(320px,0.9fr)] xl:grid-cols-[104px_minmax(0,1fr)_minmax(360px,0.95fr)]">
      <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:grid lg:auto-rows-max lg:content-start lg:gap-3 lg:self-start lg:overflow-visible lg:pb-0">
        {gallery.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setSelectedImage(i)}
            className={`relative h-[74px] w-[74px] shrink-0 overflow-hidden rounded-md border transition sm:h-[84px] sm:w-[84px] md:h-[88px] md:w-[88px] ${
              i === selectedImage
                ? "border-[#FB8500] shadow-[0_16px_25px_-18px_rgba(251,133,0,0.95)]"
                : "border-[#dce3ea] hover:border-[#F92D0A]/60"
            }`}
          >
            <Image
              src={src}
              alt={`${product.name} thumbnail ${i + 1}`}
              fill
              sizes="(max-width: 640px) 74px, (max-width: 1024px) 84px, 88px"
              className="object-contain p-1"
            />
          </button>
        ))}
      </div>

      <div className="order-1 relative min-h-[320px] overflow-hidden rounded-xl border border-[#dce3ea] bg-[#f5f5f5] shadow-[0_24px_36px_-30px_rgba(33,14,20,0.65)] sm:min-h-[420px] lg:order-2 lg:min-h-[520px]">
        <Image
          src={activeImage}
          alt={product.name}
          fill
          sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 50vw, 42vw"
          className="object-contain p-4 sm:p-6"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#210E14]/10 via-transparent to-transparent" />
      </div>

      <div className="order-3 space-y-4 rounded-xl border border-[#dce3ea] bg-white/90 p-5 text-[#210E14] shadow-[0_24px_40px_-30px_rgba(33,14,20,0.7)] backdrop-blur-sm sm:p-6">
        <h1 className="font-display text-4xl font-semibold leading-tight md:text-5xl">{product.name}</h1>
        <p className="text-sm text-zinc-500">
          Rated 5/5 ({reviews} Reviews) | <span className="text-green-600">In Stock</span>
        </p>
        <p className="text-4xl font-semibold">${product.price.toFixed(2)}</p>
        <p className="text-sm text-zinc-600">{description}</p>

        <div className="border-t border-[#e5e7eb] pt-4" />

        <div className="space-y-3">
          <p className="text-lg">Colors:</p>
          <div className="flex gap-2">
            {COLORS.map((color, index) => (
              <button
                key={color}
                type="button"
                aria-label={`Select color ${index + 1}`}
                onClick={() => setSelectedColor(index)}
                style={{ background: color }}
                className={`size-5 rounded-full border transition ${
                  selectedColor === index ? "scale-110 border-[#210E14]" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {optionGroups.map((group) => (
          <div key={group.label} className="space-y-3">
            <p className="text-lg">{group.label}:</p>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const active = selectedOptions[group.label] === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setSelectedOptions((prev) => ({ ...prev, [group.label]: option }))
                    }
                    className={`rounded-md border px-3 py-1 text-sm font-medium transition ${
                      active
                        ? "border-[#F92D0A] bg-gradient-to-r from-[#FB8500] to-[#F92D0A] text-white shadow-[0_12px_20px_-16px_rgba(249,45,10,0.95)]"
                        : "border-[#dce3ea] bg-white hover:border-[#FB8500]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <p className="text-xs text-[#748692]">{detailSummary.join(" | ")}</p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded border border-[#e5e7eb]">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="grid size-10 place-items-center transition hover:text-[#F92D0A]"
            >
              -
            </button>
            <span className="grid size-10 place-items-center border-x border-[#e5e7eb]">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="grid size-10 place-items-center bg-[#F92D0A] text-white"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={(e) =>
              {
              cart.addItem(
                {
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl
                },
                quantity
              );
              animateFlyToTarget(e.currentTarget, '[data-fly-target="cart"]', {
                color: "#FB8500",
                size: 15,
                kind: "product",
                imageUrl: product.imageUrl
              });
              }
            }
            className="h-10 rounded bg-gradient-to-r from-[#FB8500] to-[#F92D0A] px-8 text-sm font-semibold text-white transition hover:brightness-110"
          >
            Add To Cart
          </button>
          <button
            type="button"
            onClick={(e) => {
              wishlist.toggle(product.id);
              if (!inWishlist) {
                animateFlyToTarget(e.currentTarget, '[data-fly-target="wishlist"]', {
                  color: "#F92D0A",
                  size: 13,
                  kind: "heart"
                });
              }
            }}
            className={`grid size-10 place-items-center rounded border transition ${
              inWishlist
                ? "border-[#F92D0A] bg-[#F92D0A] text-white"
                : "border-[#dce3ea] bg-white hover:border-[#F92D0A] hover:text-[#F92D0A]"
            }`}
          >
            <Heart className="size-4" />
          </button>
        </div>

        <div className="overflow-hidden rounded-lg border border-[#210E14]/70 bg-white">
          <div className="border-b border-[#e5e7eb] p-4">
            <p className="flex items-center gap-2 text-lg font-semibold">
              <Truck className="size-4 text-[#F92D0A]" />
              Free Delivery
            </p>
            <p className="text-sm text-zinc-600 underline">
              Enter your postal code for Delivery Availability
            </p>
          </div>
          <div className="space-y-1 p-4">
            <p className="flex items-center gap-2 text-lg font-semibold">
              <RotateCcw className="size-4 text-[#F92D0A]" />
              Return Delivery
            </p>
            <p className="text-sm text-zinc-600">Free 30 Days Delivery Returns. Details</p>
            <p className="text-xs text-[#748692]">
              <ShieldCheck className="mr-1 inline size-3.5 text-[#28323F]" />
              Protected checkout with quality assurance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
