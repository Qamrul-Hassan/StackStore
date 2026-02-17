"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: { rate: number; count: number };
};

type DummyJsonProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  images?: string[];
  thumbnail?: string;
  rating?: number;
  reviews?: Array<{ rating?: number }>;
};

type DummyJsonProductsResponse = {
  products?: DummyJsonProduct[];
};

const customHeadphoneProduct: Product = {
  id: 1001,
  title: "WH-1000XM Premium Headphone",
  price: 320,
  description:
    "Wireless noise-canceling headphone with balanced sound, deep bass, and all-day comfort.",
  category: "electronics",
  image:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400&auto=format&fit=crop",
  rating: { rate: 4.8, count: 182 }
};

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type DataContextType = {
  products: Product[];
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

function normalizeCategory(category: string) {
  const value = category.toLowerCase();
  if (
    value.includes("electronics") ||
    value.includes("smartphone") ||
    value.includes("laptop") ||
    value.includes("tablet") ||
    value.includes("mobile-accessories") ||
    value.includes("headphone") ||
    value.includes("audio")
  ) {
    return "electronics";
  }
  return category;
}

function mapDummyToProduct(item: DummyJsonProduct): Product {
  return {
    id: 5000 + item.id,
    title: item.title,
    price: item.price,
    description: item.description,
    category: normalizeCategory(item.category),
    image: item.images?.[0] ?? item.thumbnail ?? customHeadphoneProduct.image,
    rating: {
      rate: item.rating ?? 4,
      count: item.reviews?.length ?? 50
    }
  };
}

function mergeUniqueProducts(primary: Product[], secondary: Product[]) {
  const merged = [...primary];
  const existing = new Set(primary.map((item) => item.title.trim().toLowerCase()));
  for (const item of secondary) {
    const key = item.title.trim().toLowerCase();
    if (!existing.has(key)) {
      existing.add(key);
      merged.push(item);
    }
  }
  return merged;
}

export function DataContextProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Post[]>([]);
  const [offers, setOffers] = useState<Post[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [loadingOffers, setLoadingOffers] = useState(true);

  async function refetchProducts() {
    setLoadingProducts(true);
    try {
      const [fakeStoreResult, dummyResult] = await Promise.allSettled([
        fetch("https://fakestoreapi.com/products", { cache: "no-store" }),
        fetch("https://dummyjson.com/products?limit=100", { cache: "no-store" })
      ]);

      let fakeStoreProducts: Product[] = [];
      let dummyProducts: Product[] = [];

      if (fakeStoreResult.status === "fulfilled" && fakeStoreResult.value.ok) {
        const data = (await fakeStoreResult.value.json()) as Product[];
        fakeStoreProducts = Array.isArray(data) ? data : [];
      }

      if (dummyResult.status === "fulfilled" && dummyResult.value.ok) {
        const data = (await dummyResult.value.json()) as DummyJsonProductsResponse;
        dummyProducts = Array.isArray(data.products)
          ? data.products.map(mapDummyToProduct)
          : [];
      }

      const mergedProducts = mergeUniqueProducts(fakeStoreProducts, dummyProducts);
      const hasHeadphone = mergedProducts.some((item) =>
        item.title.toLowerCase().includes("headphone")
      );

      setProducts(hasHeadphone ? mergedProducts : [customHeadphoneProduct, ...mergedProducts]);
    } catch {
      setProducts([customHeadphoneProduct]);
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
