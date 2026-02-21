"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";

type WishlistContextType = {
  ids: string[];
  count: number;
  isAuthenticated: boolean;
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
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
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
  const hasLoadedRemoteRef = useRef(false);
  const syncTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  useEffect(() => {
    if (!isAuthenticated || hasLoadedRemoteRef.current) return;

    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch("/api/user/wishlist", { cache: "no-store" });
        if (!res.ok) return;
        const payload = (await res.json()) as { ids?: string[] };
        const remote = normalizeIds(payload.ids);
        setIds((prev) => Array.from(new Set([...remote, ...prev])));
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
      void fetch("/api/user/wishlist", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids })
      });
    }, 240);

    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [ids, isAuthenticated]);

  useEffect(() => {
    if (status === "unauthenticated") {
      hasLoadedRemoteRef.current = false;
    }
  }, [status]);

  const value = useMemo(
    () => ({
      ids,
      count: ids.length,
      isAuthenticated,
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
    [ids, isAuthenticated]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
