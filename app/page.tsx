"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Armchair,
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Flower2,
  Gamepad2,
  Gem,
  Headphones,
  Home,
  Laptop,
  ShoppingBasket,
  Shirt,
  ShieldCheck,
  Smartphone,
  Truck,
  UtensilsCrossed,
  Watch
} from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useDataContext } from "@/components/data-context";
import { ProductCard } from "@/components/product-card";
import type { CatalogProduct } from "@/lib/catalog";
import { extractCategories, formatCategory, toCategorySlug } from "@/lib/catalog";
import { storeItems } from "@/lib/store-data";

const fallbackProducts: CatalogProduct[] = storeItems.map((item) => ({
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
  stock: 25,
  discountPercentage: undefined,
  colors: ["#FB8500", "#F92D0A", "#712825", "#210E14", "#28323F"]
}));

const HERO_PHONE_TARGETS = [
  ["iphone", "9"],
  ["iphone", "x"],
  ["samsung", "universe", "9"],
  ["oppo", "f19"],
  ["huawei", "p30"]
];
const HERO_PRODUCT_IDS = ["dj-1", "dj-2", "dj-3", "dj-4", "dj-5"];

export default function HomePage() {
  const { products, loadingProducts } = useDataContext();
  const catalog = products.length > 0 ? products : fallbackProducts;
  const [heroPage, setHeroPage] = useState(0);
  const [explorePage, setExplorePage] = useState(0);

  const allCategories = useMemo(
    () => extractCategories(catalog).sort((a, b) => formatCategory(a).localeCompare(formatCategory(b))),
    [catalog]
  );
  const homeCategoryLinks = useMemo(() => {
    const links = allCategories.map((category) => ({
      label: formatCategory(category),
      slug: toCategorySlug(category)
    }));

    links.unshift({ label: "Women's Fashion", slug: "womans-fashion" });
    return links;
  }, [allCategories]);
  const heroProducts = useMemo(() => {
    const phoneLike = catalog.filter((item) => {
      const category = toCategorySlug(item.category);
      const name = normalizeName(item.name);
      return (
        category.includes("smartphone") ||
        name.includes("iphone") ||
        name.includes("samsung") ||
        name.includes("oppo") ||
        name.includes("huawei") ||
        name.includes("phone")
      );
    });

    const picked: CatalogProduct[] = [];
    const taken = new Set<string>();

    for (const id of HERO_PRODUCT_IDS) {
      const byId = catalog.find((item) => item.id === id);
      if (byId && !taken.has(byId.id)) {
        picked.push(byId);
        taken.add(byId.id);
      }
    }

    for (const targetTokens of HERO_PHONE_TARGETS) {
      const match = phoneLike.find((item) => {
        const normalizedName = normalizeName(item.name);
        return targetTokens.every((token) => normalizedName.includes(normalizeName(token)));
      });
      if (match && !taken.has(match.id)) {
        picked.push(match);
        taken.add(match.id);
      }
    }

    const fillPool = (phoneLike.length > 0 ? phoneLike : catalog).filter(
      (item) => !taken.has(item.id)
    );
    const required = 5;
    const withFill = [...picked];
    for (const item of fillPool) {
      if (withFill.length >= required) break;
      withFill.push(item);
    }

    return withFill.length > 0 ? withFill : catalog.slice(0, 5);
  }, [catalog]);
  const heroPageCount = Math.max(1, heroProducts.length);
  const safeHeroPage = heroPage % heroPageCount;
  const activeHeroProduct = heroProducts[safeHeroPage] ?? heroProducts[0] ?? catalog[0] ?? fallbackProducts[0];
  const heroTitle = getHeroTopLabel(activeHeroProduct.name);
  const heroImage = getHeroImageForProduct(activeHeroProduct.name, activeHeroProduct.imageUrl);
  const heroDiscount = Math.max(
    10,
    Math.round(
      activeHeroProduct.discountPercentage ??
        (activeHeroProduct.oldPrice && activeHeroProduct.oldPrice > activeHeroProduct.price
          ? ((activeHeroProduct.oldPrice - activeHeroProduct.price) / activeHeroProduct.oldPrice) * 100
          : 0)
    )
  );

  const flashSale = useMemo(
    () =>
      [...catalog]
        .sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0))
        .slice(0, 4),
    [catalog]
  );

  const bestSelling = useMemo(
    () => [...catalog].sort((a, b) => b.rating - a.rating).slice(0, 4),
    [catalog]
  );

  const explore = useMemo(() => catalog.slice(0, 16), [catalog]);
  const explorePageSize = 8;
  const explorePageCount = Math.max(1, Math.ceil(explore.length / explorePageSize));
  const safeExplorePage = explorePage % explorePageCount;
  const activeExplore = useMemo(() => {
    const start = safeExplorePage * explorePageSize;
    return explore.slice(start, start + explorePageSize);
  }, [explore, safeExplorePage]);
  const featured = useMemo(() => catalog.slice(8, 12), [catalog]);
  const promoProduct = catalog[1] ?? fallbackProducts[1] ?? fallbackProducts[0];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroPage((prev) => (prev + 1) % heroPageCount);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [heroPageCount]);

  return (
    <div className="space-y-10 pb-12 pt-4 md:space-y-12 md:pt-6 lg:space-y-14 lg:pt-8">
      <section id="hero" className="section-single-cart cart-left mt-0 grid gap-4 lg:grid-cols-[265px_1fr] lg:items-stretch lg:gap-6">
        <aside className="glass-panel section-shell hidden h-full p-5 lg:flex lg:h-[500px] lg:flex-col">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#712825]">Shop Categories</p>
          <ul className="no-scrollbar flex-1 space-y-2 overflow-auto pr-1 text-sm text-[#210E14]">
            {homeCategoryLinks.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="flex items-center justify-between rounded-lg px-2.5 py-2 transition hover:bg-[#FB8500]/10 hover:text-[#F92D0A]"
                >
                  <span>{category.label}</span>
                  <ChevronRight className="size-4" />
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="section-shell relative overflow-hidden rounded-2xl border border-[#344154] bg-gradient-to-r from-[#210E14] via-[#28323F] to-[#210E14] px-4 pb-4 pt-4 text-white shadow-[0_40px_62px_-38px_rgba(33,14,20,0.95)] sm:px-6 sm:pb-5 sm:pt-5 md:px-9 md:pb-6 md:pt-6 lg:flex lg:h-[500px] lg:flex-col">
          <div className="pointer-events-none absolute -left-20 top-1/2 size-72 -translate-y-1/2 rounded-full bg-[#FB8500]/24 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-[#F92D0A]/20 blur-3xl" />
          <div className="grid items-center gap-4 sm:gap-5 md:grid-cols-[1fr_390px] lg:flex-1">
            <div className="space-y-3 sm:space-y-5">
              <p className="text-lg leading-tight text-white/90 sm:text-xl md:text-[1.7rem]">{heroTitle}</p>
              <h1 className="text-3xl font-semibold leading-[1.05] sm:text-4xl md:text-5xl">Up to {heroDiscount}% off Voucher</h1>
              <Link
                href={`/products/${activeHeroProduct.slug}`}
                className="inline-flex items-center gap-2 border-b border-white/80 pb-1 text-base font-medium transition hover:text-[#FB8500] sm:text-lg md:text-xl"
              >
                Shop Now <ArrowRight className="size-6" />
              </Link>
            </div>
            <div className="relative h-48 sm:h-60 md:h-[350px]">
              <Image src={heroImage} alt={activeHeroProduct.name} fill unoptimized className="object-contain" />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            {Array.from({ length: heroPageCount }).map((_, idx) => (
              <button
                type="button"
                key={idx}
                aria-label={`Go to hero page ${idx + 1}`}
                onClick={() => setHeroPage(idx)}
                className={`size-2.5 rounded-full transition ${
                  idx === safeHeroPage
                    ? "bg-[#F92D0A] ring-2 ring-white/80"
                    : "bg-white/45 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel section-shell section-single-cart cart-right p-5 sm:p-6">
        <h2 className="sr-only">Store Highlights</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatPill label="Products Live" value={`${catalog.length}+`} />
          <StatPill label="Hot Discounts" value={`${flashSale.length} Today`} />
          <StatPill label="Top Rated Picks" value={`${bestSelling.length} Featured`} />
        </div>
      </section>

      <section id="flash-sales" className="glass-panel section-shell space-y-6 p-5 sm:p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="section-tag">Today&apos;s</p>
            <h2 className="section-title">Flash Sales</h2>
          </div>
          <div className="text-left sm:text-right">
            {loadingProducts ? <p className="text-sm text-[#748692]">Refreshing products...</p> : null}
            <Link href="/categories/all" className="text-sm font-semibold text-[#F92D0A] hover:text-[#FB8500]">
              See all deals
            </Link>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {flashSale.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <section id="categories" className="glass-panel section-shell section-single-cart cart-left space-y-6 p-5 sm:p-6 md:p-8">
        <div className="space-y-2">
          <p className="section-tag">Categories</p>
          <h2 className="section-title">Browse By Category ({allCategories.length})</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {homeCategoryLinks.map((category) => (
            <Link
              href={`/categories/${category.slug}`}
              key={category.slug}
              className="group rounded-xl border border-[#dae1ea] bg-white px-3 py-4 text-[#210E14] shadow-[0_16px_26px_-20px_rgba(33,14,20,0.65)] transition hover:-translate-y-0.5 hover:border-[#F92D0A]/45 hover:bg-[#FB8500]/5"
            >
              <span className="mb-2 inline-flex size-9 items-center justify-center rounded-full bg-[#F4F6FA] text-[#28323F] transition group-hover:bg-[#FB8500]/15 group-hover:text-[#F92D0A]">
                {categoryIcon(category.label)}
              </span>
              <p className="text-sm font-semibold">{category.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="best-selling" className="glass-panel section-shell section-single-cart cart-right space-y-6 p-5 sm:p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 sm:items-center">
          <div className="space-y-2">
            <p className="section-tag">Top Rated</p>
            <h2 className="section-title">Best Selling Products</h2>
          </div>
          <Link href="/categories/all" className="lava-button inline-flex px-6 py-2.5 sm:px-7 sm:py-3">
            View All
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSelling.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <section className="section-shell relative overflow-hidden rounded-2xl border border-[#3e4a5b] bg-[#210E14] px-5 py-7 text-white shadow-[0_32px_46px_-30px_rgba(33,14,20,0.95)] sm:px-7 sm:py-9 md:px-12 md:py-10">
        <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#FB8500]">Featured Product</p>
            <h2 className="text-4xl font-semibold leading-tight md:text-5xl">{promoProduct.name}</h2>
            <p className="max-w-md text-sm text-white/80">{promoProduct.description}</p>
            <Link href={`/products/${promoProduct.slug}`} className="lava-button inline-flex px-8 py-3">
              Buy Now
            </Link>
          </div>
          <div className="relative h-60 overflow-hidden rounded-xl border border-white/25 md:h-72">
            <Image src={promoProduct.imageUrl} alt={promoProduct.name} fill unoptimized className="object-cover" />
          </div>
        </div>
      </section>

      <section id="explore-products" className="glass-panel section-shell section-single-cart cart-left space-y-6 p-5 sm:p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="section-tag">Our Products</p>
            <h2 className="section-title">Explore Our Products</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous explore page"
              onClick={() => setExplorePage((prev) => (prev - 1 + explorePageCount) % explorePageCount)}
              className="grid size-9 place-items-center rounded-full border border-[#dce3ea] bg-white text-[#210E14] transition hover:border-[#FB8500] hover:text-[#F92D0A]"
            >
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: explorePageCount }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setExplorePage(idx)}
                className={`grid size-9 place-items-center rounded-full border text-xs font-semibold transition ${
                  idx === safeExplorePage
                    ? "border-[#F92D0A] bg-[#F92D0A] text-white"
                    : "border-[#dce3ea] bg-white text-[#210E14] hover:border-[#FB8500] hover:text-[#F92D0A]"
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              type="button"
              aria-label="Next explore page"
              onClick={() => setExplorePage((prev) => (prev + 1) % explorePageCount)}
              className="grid size-9 place-items-center rounded-full border border-[#dce3ea] bg-white text-[#210E14] transition hover:border-[#FB8500] hover:text-[#F92D0A]"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {activeExplore.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <section id="featured" className="glass-panel section-shell section-single-cart cart-right space-y-6 p-5 sm:p-6 md:p-8">
        <div className="space-y-2">
          <p className="section-tag">New Arrival</p>
          <h2 className="section-title">Fresh In Store</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <section id="support" className="glass-panel section-shell section-single-cart cart-left p-6 text-center sm:p-8">
        <h2 className="sr-only">Support Features</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureIcon icon={<Truck className="size-5" />} title="FREE AND FAST DELIVERY" copy="Free delivery for all orders over $140" />
          <FeatureIcon icon={<ShieldCheck className="size-5" />} title="SECURE CHECKOUT" copy="Protected payment and trusted fulfillment" />
          <FeatureIcon icon={<Headphones className="size-5" />} title="24/7 CUSTOMER SUPPORT" copy="Always available when you need help" />
        </div>
      </section>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/60 bg-white/90 px-4 py-3 shadow-[0_16px_24px_-20px_rgba(33,14,20,0.7)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#712825]">{label}</p>
      <p className="mt-1 text-lg font-semibold text-[#210E14]">{value}</p>
    </div>
  );
}

function categoryIcon(category: string) {
  const value = category.toLowerCase();
  if (value.includes("women")) return <ShoppingBasket className="size-5" />;
  if (value.includes("beauty") || value.includes("skin")) return <Flower2 className="size-5" />;
  if (value.includes("fragrance")) return <Gem className="size-5" />;
  if (value.includes("furniture")) return <Armchair className="size-5" />;
  if (value.includes("grocer")) return <ShoppingBasket className="size-5" />;
  if (value.includes("home decor")) return <Home className="size-5" />;
  if (value.includes("kitchen")) return <UtensilsCrossed className="size-5" />;
  if (value.includes("shirt") || value.includes("tops")) return <Shirt className="size-5" />;
  if (value.includes("shoe")) return <Shirt className="size-5" />;
  if (value.includes("mobile accessories")) return <Smartphone className="size-5" />;
  if (value.includes("phone")) return <Smartphone className="size-5" />;
  if (value.includes("laptop") || value.includes("computer")) return <Laptop className="size-5" />;
  if (value.includes("watch")) return <Watch className="size-5" />;
  if (value.includes("camera")) return <Camera className="size-5" />;
  if (value.includes("audio") || value.includes("head")) return <Headphones className="size-5" />;
  if (value.includes("gaming") || value.includes("game")) return <Gamepad2 className="size-5" />;
  return <ShoppingBasket className="size-5" />;
}

function FeatureIcon({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) {
  return (
    <div className="space-y-2">
      <div className="mx-auto icon-circle">{icon}</div>
      <h3 className="text-lg font-semibold text-[#210E14]">{title}</h3>
      <p className="text-sm text-zinc-500">{copy}</p>
    </div>
  );
}

function getHeroTopLabel(name: string) {
  if (name.toLowerCase().includes("iphone 14")) return "iPhone 14 Series";
  return name;
}

function getHeroImageForProduct(name: string, fallbackImage: string) {
  if (name.toLowerCase().includes("iphone 14")) {
    return "https://images.unsplash.com/photo-1663499482523-8f4fc78f7f5d?q=80&w=1200&auto=format&fit=crop";
  }
  return fallbackImage;
}

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}


