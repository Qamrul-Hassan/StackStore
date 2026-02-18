"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CatalogProduct, getFallbackCatalogProducts, mapDummyJsonProduct } from "@/lib/catalog";

type DummyJsonProductResponse = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category: string;
  images?: string[];
  thumbnail?: string;
};

type DummyJsonProductsResponse = {
  products?: DummyJsonProductResponse[];
};

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type DataContextType = {
  products: CatalogProduct[];
  blogs: Post[];
  offers: Post[];
  loadingProducts: boolean;
  loadingBlogs: boolean;
  loadingOffers: boolean;
  refetchProducts: () => Promise<void>;
  refetchBlogs: () => Promise<void>;
  refetchOffers: () => Promise<void>;
};

const DataContext = createContext<DataContextType | null>(null);

export function DataContextProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [blogs, setBlogs] = useState<Post[]>([]);
  const [offers, setOffers] = useState<Post[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);

  async function refetchProducts() {
    setLoadingProducts(true);
    try {
      const response = await fetch("https://dummyjson.com/products?limit=100", {
        cache: "no-store"
      });
      if (!response.ok) throw new Error(`Products fetch failed: ${response.status}`);
      const data = (await response.json()) as DummyJsonProductsResponse;
      const list = Array.isArray(data.products) ? data.products.map(mapDummyJsonProduct) : [];
      setProducts(list);
    } catch {
      setProducts(getFallbackCatalogProducts());
    } finally {
      setLoadingProducts(false);
    }
  }

  async function refetchBlogs() {
    setLoadingBlogs(true);
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        cache: "no-store"
      });
      if (!response.ok) throw new Error(`Blogs fetch failed: ${response.status}`);
      const data = (await response.json()) as Post[];
      setBlogs(Array.isArray(data) ? data : []);
    } catch {
      setBlogs([]);
    } finally {
      setLoadingBlogs(false);
    }
  }

  async function refetchOffers() {
    setLoadingOffers(true);
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        cache: "no-store"
      });
      if (!response.ok) throw new Error(`Offers fetch failed: ${response.status}`);
      const data = (await response.json()) as Post[];
      setOffers(Array.isArray(data) ? data : []);
    } catch {
      setOffers([]);
    } finally {
      setLoadingOffers(false);
    }
  }

  useEffect(() => {
    void refetchProducts();
    void refetchBlogs();
    void refetchOffers();
  }, []);

  const value = useMemo(
    () => ({
      products,
      blogs,
      offers,
      loadingProducts,
      loadingBlogs,
      loadingOffers,
      refetchProducts,
      refetchBlogs,
      refetchOffers
    }),
    [products, blogs, offers, loadingProducts, loadingBlogs, loadingOffers]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useDataContext() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useDataContext must be used within DataContextProvider");
  return ctx;
}
