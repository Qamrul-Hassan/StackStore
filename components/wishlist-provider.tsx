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
const DEFAULT_IDS: string[] = [];

function normalizeId(id: string | number) {
  return String(id).trim();
}

function normalizeIds(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const normalized = input
    .map((item) => {
      if (typeof item === "string" || typeof item === "number") return normalizeId(item);
      if (item && typeof item === "object" && "id" in item) {
        const record = item as { id?: unknown };
        if (typeof record.id === "string" || typeof record.id === "number") {
          return normalizeId(record.id);
        }
      }
      return "";
    })
    .filter(Boolean);
  return Array.from(new Set(normalized));
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_IDS;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_IDS;
    try {
      const parsed = JSON.parse(raw);
      return normalizeIds(parsed);
    } catch {
      return DEFAULT_IDS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      has(id: string) {
        return ids.includes(normalizeId(id));
      },
      add(id: string) {
        const nextId = normalizeId(id);
        setIds((prev) => (prev.includes(nextId) ? prev : [...prev, nextId]));
      },
      remove(id: string) {
        const nextId = normalizeId(id);
        setIds((prev) => prev.filter((v) => v !== nextId));
      },
      toggle(id: string) {
        const nextId = normalizeId(id);
        setIds((prev) => (prev.includes(nextId) ? prev.filter((v) => v !== nextId) : [...prev, nextId]));
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
