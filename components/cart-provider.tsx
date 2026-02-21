"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  total: number;
  isAuthenticated: boolean;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "stackstore_cart_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as CartItem[];
    } catch {
      return [];
    }
  });
  const hasLoadedRemoteRef = useRef(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!isAuthenticated || hasLoadedRemoteRef.current) return;

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/user/cart", { cache: "no-store" });
        if (!res.ok) return;
        const payload = (await res.json()) as { items?: CartItem[] };
        const remote = Array.isArray(payload.items) ? payload.items : [];

        setItems((prev) => {
          const merged = new Map<string, CartItem>();
          for (const item of remote) merged.set(item.productId, item);
          for (const item of prev) {
            const exists = merged.get(item.productId);
            if (!exists) merged.set(item.productId, item);
            else merged.set(item.productId, { ...exists, quantity: exists.quantity + item.quantity });
          }
          return Array.from(merged.values());
        });
      } finally {
        if (!cancelled) hasLoadedRemoteRef.current = true;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !hasLoadedRemoteRef.current) return;
    if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

    syncTimeoutRef.current = setTimeout(() => {
      void fetch("/api/user/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
      });
    }, 240);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [isAuthenticated, items]);

  useEffect(() => {
    if (status === "unauthenticated") {
      hasLoadedRemoteRef.current = false;
    }
  }, [status]);

  const value = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items,
      total,
      isAuthenticated,
      addItem(item: Omit<CartItem, "quantity">, quantity = 1) {
        setItems((prev) => {
          const existing = prev.find((v) => v.productId === item.productId);
          if (!existing) return [...prev, { ...item, quantity }];
          return prev.map((v) =>
            v.productId === item.productId
              ? { ...v, quantity: v.quantity + quantity }
              : v
          );
        });
      },
      removeItem(productId: string) {
        setItems((prev) => prev.filter((v) => v.productId !== productId));
      },
      updateQuantity(productId: string, quantity: number) {
        if (quantity < 1) return;
        setItems((prev) =>
          prev.map((v) => (v.productId === productId ? { ...v, quantity } : v))
        );
      },
      clear() {
        setItems([]);
      }
    };
  }, [isAuthenticated, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
