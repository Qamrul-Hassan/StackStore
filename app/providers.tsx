"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/components/cart-provider";
import { DataContextProvider } from "@/components/data-context";
import { WishlistProvider } from "@/components/wishlist-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DataContextProvider>
        <CartProvider>
          <WishlistProvider>{children}</WishlistProvider>
        </CartProvider>
      </DataContextProvider>
    </SessionProvider>
  );
}
