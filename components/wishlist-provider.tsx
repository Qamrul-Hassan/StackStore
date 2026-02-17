"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type WishlistContextType = {
  ids: string[];
  count: number;
  has: (id: string) => boolean;
  add: (id: string) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextType | null>(null);
const STORAGE_KEY = "stackstore_wishlist_v1";
const DEFAULT_IDS = ["1", "2", "3", "4"];

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>(DEFAULT_IDS);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setIds(parsed);
    } catch {
      setIds(DEFAULT_IDS);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      has(id: string) {
        return ids.includes(id);
      },
      add(id: string) {
        setIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      },
      remove(id: string) {
        setIds((prev) => prev.filter((v) => v !== id));
      },
      toggle(id: string) {
        setIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
      },
      clear() {
        setIds([]);
      }
    }),
    [ids]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
