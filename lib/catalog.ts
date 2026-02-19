import { storeItems } from "@/lib/store-data";

type DummyJsonProduct = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  category: string;
  thumbnail?: string;
  images?: string[];
};

type DummyJsonProductsResponse = {
  products?: DummyJsonProduct[];
  total?: number;
  skip?: number;
  limit?: number;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  images: string[];
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  category: string;
  stock: number;
  brand?: string;
  discountPercentage?: number;
  colors?: string[];
};

const PRODUCT_COLORS = ["#FB8500", "#F92D0A", "#712825", "#210E14", "#28323F"];

const PHONE_FALLBACK_PRODUCTS: CatalogProduct[] = [
  {
    id: "dj-1",
    slug: "iphone-9-1",
    name: "iPhone 9",
    description: "An apple mobile which is nothing like apple.",
    imageUrl: "https://cdn.dummyjson.com/product-images/smartphones/iphone-9/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/smartphones/iphone-9/1.webp"],
    price: 549,
    oldPrice: 629,
    rating: 4.69,
    reviews: 122,
    badge: "-13%",
    category: "smartphones",
    stock: 94,
    brand: "Apple",
    discountPercentage: 12.96,
    colors: PRODUCT_COLORS
  },
  {
    id: "dj-2",
    slug: "iphone-x-2",
    name: "iPhone X",
    description: "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology.",
    imageUrl: "https://cdn.dummyjson.com/product-images/smartphones/iphone-x/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/smartphones/iphone-x/1.webp"],
    price: 899,
    oldPrice: 1049,
    rating: 4.44,
    reviews: 116,
    badge: "-14%",
    category: "smartphones",
    stock: 34,
    brand: "Apple",
    discountPercentage: 14.27,
    colors: PRODUCT_COLORS
  },
  {
    id: "dj-3",
    slug: "samsung-universe-9-3",
    name: "Samsung Universe 9",
    description: "Samsung's new variant which goes beyond Galaxy to the Universe.",
    imageUrl: "https://cdn.dummyjson.com/product-images/smartphones/samsung-universe-9/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/smartphones/samsung-universe-9/1.webp"],
    price: 1249,
    oldPrice: 1460,
    rating: 4.09,
    reviews: 107,
    badge: "-14%",
    category: "smartphones",
    stock: 36,
    brand: "Samsung",
    discountPercentage: 15.46,
    colors: PRODUCT_COLORS
  },
  {
    id: "dj-4",
    slug: "oppof19-4",
    name: "OPPOF19",
    description: "OPPO F19 is officially announced with 6.43-inch AMOLED display.",
    imageUrl: "https://cdn.dummyjson.com/product-images/smartphones/oppof19/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/smartphones/oppof19/1.webp"],
    price: 280,
    oldPrice: 330,
    rating: 4.3,
    reviews: 112,
    badge: "-15%",
    category: "smartphones",
    stock: 123,
    brand: "OPPO",
    discountPercentage: 17.91,
    colors: PRODUCT_COLORS
  },
  {
    id: "dj-5",
    slug: "huawei-p30-5",
    name: "Huawei P30",
    description: "Huawei's re-badged P30 Pro New Edition launched in Germany and comes with Google Mobile Services.",
    imageUrl: "https://cdn.dummyjson.com/product-images/smartphones/huawei-p30/thumbnail.webp",
    images: ["https://cdn.dummyjson.com/product-images/smartphones/huawei-p30/1.webp"],
    price: 499,
    oldPrice: 576,
    rating: 4.09,
    reviews: 106,
    badge: "-13%",
    category: "smartphones",
    stock: 32,
    brand: "Huawei",
    discountPercentage: 10.58,
    colors: PRODUCT_COLORS
  }
];

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replaceAll("&", "and")
    .replaceAll("'", "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatCategory(category: string) {
  return category
    .replaceAll("-", " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function toCategorySlug(category: string) {
  return slugify(category);
}

export function mapDummyJsonProduct(item: DummyJsonProduct): CatalogProduct {
  const discount = item.discountPercentage ?? 0;
  const oldPrice =
    discount > 0 ? Math.round(item.price / (1 - discount / 100)) : undefined;
  const primary = item.thumbnail ?? item.images?.[0] ?? "/assets/products/havit-hv-g92-gamepad.svg";
  const gallery = item.images?.length ? item.images : [primary, primary, primary, primary];

  return {
    id: `dj-${item.id}`,
    slug: `${slugify(item.title)}-${item.id}`,
    name: item.title,
    description: item.description,
    imageUrl: primary,
    images: gallery,
    price: item.price,
    oldPrice,
    rating: item.rating ?? 4.5,
    reviews: Math.max(8, Math.round((item.rating ?? 4.5) * 26)),
    badge: discount > 0 ? `-${Math.round(discount)}%` : undefined,
    category: item.category,
    stock: item.stock ?? 0,
    brand: item.brand,
    discountPercentage: item.discountPercentage,
    colors: PRODUCT_COLORS
  };
}

export function getFallbackCatalogProducts(): CatalogProduct[] {
  const fromStore = storeItems.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    description: `${item.name} from our curated catalog.`,
    imageUrl: item.imageUrl,
    images: item.images?.length ? item.images : [item.imageUrl, item.imageUrl, item.imageUrl, item.imageUrl],
    price: item.price,
    oldPrice: item.oldPrice,
    rating: item.rating,
    reviews: item.reviews,
    badge: item.badge,
    category: "featured",
    stock: 20,
    colors: PRODUCT_COLORS
  }));

  const existing = new Set(fromStore.map((item) => item.id));
  const phones = PHONE_FALLBACK_PRODUCTS.filter((item) => !existing.has(item.id));
  return [...phones, ...fromStore];
}

export async function fetchCatalogProducts(limit = 100): Promise<CatalogProduct[]> {
  try {
    const firstResponse = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=0`, {
      next: { revalidate: 900 }
    });
    if (!firstResponse.ok) throw new Error(`DummyJSON error: ${firstResponse.status}`);
    const firstData = (await firstResponse.json()) as DummyJsonProductsResponse;
    if (!Array.isArray(firstData.products)) throw new Error("No products list");

    const total = firstData.total ?? firstData.products.length;
    const batchSize = firstData.limit ?? limit;
    const all = [...firstData.products];

    for (let skip = all.length; skip < total; skip += batchSize) {
      const response = await fetch(`https://dummyjson.com/products?limit=${batchSize}&skip=${skip}`, {
        next: { revalidate: 900 }
      });
      if (!response.ok) break;
      const data = (await response.json()) as DummyJsonProductsResponse;
      if (!Array.isArray(data.products) || data.products.length === 0) break;
      all.push(...data.products);
    }

    return all.map(mapDummyJsonProduct);
  } catch {
    return getFallbackCatalogProducts();
  }
}

export function extractCategories(products: CatalogProduct[]) {
  return Array.from(new Set(products.map((p) => p.category)));
}
