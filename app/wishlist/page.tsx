"use client";

import { ProductCard } from "@/components/product-card";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { storeItems } from "@/lib/store-data";

export default function WishlistPage() {
  const wishlist = useWishlist();
  const cart = useCart();

  const list = storeItems.filter((item) => wishlist.ids.includes(item.id));
  const justForYou = storeItems.filter((item) => !wishlist.ids.includes(item.id)).slice(0, 8);

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
        <h1 className="text-4xl font-semibold text-[#210E14]">Wishlist ({wishlist.count})</h1>
        <button
          onClick={moveAllToBag}
          className="rounded border border-[#210E14] px-7 py-3 text-sm font-medium text-[#210E14] transition hover:border-[#F92D0A] hover:text-[#F92D0A]"
        >
          Move All To Bag
        </button>
      </div>

      {list.length === 0 ? (
        <div className="rounded border border-dashed border-[#d1d5db] bg-white p-10 text-center text-zinc-500">
          Your wishlist is empty.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((item) => (
            <ProductCard
              key={item.id}
              product={{
                ...item,
                removable: true,
                onRemove: (id) => wishlist.remove(id)
              }}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="section-tag">Just For You</p>
        <button className="rounded border border-[#210E14] px-8 py-3 text-sm font-medium text-[#210E14] transition hover:border-[#F92D0A] hover:text-[#F92D0A]">
          See All
        </button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {justForYou.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
