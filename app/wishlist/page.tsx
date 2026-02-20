"use client";

import { useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart-provider";
import { useDataContext } from "@/components/data-context";
import { useWishlist } from "@/components/wishlist-provider";
import { storeItems } from "@/lib/store-data";

function toComparableKeys(value: string) {
  const key = String(value).trim();
  const keys = [key];
  if (key.startsWith("dj-")) keys.push(key.replace(/^dj-/, ""));
  return keys;
}

export default function WishlistPage() {
  const wishlist = useWishlist();
  const cart = useCart();
  const { products } = useDataContext();
  const wishlistKeySet = useMemo(
    () => new Set(wishlist.ids.flatMap((id) => toComparableKeys(String(id)))),
    [wishlist.ids]
  );

  const source = useMemo(() => {
    const merged = [...products, ...storeItems];
    const seen = new Set<string>();
    return merged.filter((item) => {
      const idKey = String(item.id);
      const slugKey = String(item.slug ?? "");
      if (seen.has(idKey) || (slugKey && seen.has(slugKey))) return false;
      seen.add(idKey);
      if (slugKey) seen.add(slugKey);
      return true;
    });
  }, [products]);

  const isWishlisted = (item: { id: string; slug?: string }) => {
    const idKeys = toComparableKeys(String(item.id));
    const slugKeys = item.slug ? toComparableKeys(String(item.slug)) : [];
    return [...idKeys, ...slugKeys].some((key) => wishlistKeySet.has(key));
  };
  const list = source.filter((item) => isWishlisted({ id: String(item.id), slug: item.slug }));
  const justForYou = source.filter((item) => !isWishlisted({ id: String(item.id), slug: item.slug })).slice(0, 8);

  function moveAllToBag() {
    list.forEach((item) => {
      cart.addItem({
        productId: item.id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl
      });
    });
    wishlist.clear();
  }

  return (
    <div className="space-y-12 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-white drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
          Wishlist ({wishlist.count})
        </h1>
        <button
          disabled={list.length === 0}
          onClick={moveAllToBag}
          className="rounded-lg border border-white/40 bg-white/10 px-7 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:border-[#FB8500] hover:bg-[#FB8500]/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
        >
          Move All To Bag
        </button>
      </div>

      {list.length === 0 ? (
        <div className="glass-panel section-single-cart cart-left rounded border border-dashed border-[#d1d5db] p-10 text-center text-zinc-500">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="section-single-cart cart-left grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((item) => (
            <ProductCard
              key={item.id}
              product={{
                ...item,
                removable: true,
                onRemove: () => {
                  if (item.slug) wishlist.remove(String(item.slug));
                  wishlist.remove(String(item.id));
                  if (String(item.id).startsWith("dj-")) wishlist.remove(String(item.id).replace(/^dj-/, ""));
                }
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="section-tag">Just For You</p>
        <button className="rounded-lg border border-white/40 bg-white/10 px-8 py-3 text-sm font-medium text-white backdrop-blur-sm transition hover:border-[#FB8500] hover:bg-[#FB8500]/15 hover:text-white">
          See All
        </button>
      </div>

      <div className="section-single-cart cart-right grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {justForYou.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
