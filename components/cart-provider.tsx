"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

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
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "stackstore_cart_v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return {
      items,
      total,
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
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
