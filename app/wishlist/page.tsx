"use client";

import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart-provider";
import { useDataContext } from "@/components/data-context";
import { useWishlist } from "@/components/wishlist-provider";
import { storeItems } from "@/lib/store-data";

export default function WishlistPage() {
  const wishlist = useWishlist();
  const cart = useCart();
  const { products } = useDataContext();

  const source = products.length > 0 ? products : storeItems;
  const isWishlisted = (item: { id: string; slug?: string }) =>
    wishlist.ids.includes(String(item.id)) || (item.slug ? wishlist.ids.includes(String(item.slug)) : false);
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
                onRemove: (id) => {
                  wishlist.remove(String(id));
                  wishlist.remove(String(item.id));
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
