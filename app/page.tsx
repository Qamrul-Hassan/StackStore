"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Headphones,
  Headset,
  Laptop,
  ShieldCheck,
  Smartphone,
  Truck
} from "lucide-react";
import { ReactNode, useMemo } from "react";
import { useDataContext } from "@/components/data-context";
import { ProductCard } from "@/components/product-card";
import { categories, storeItems } from "@/lib/store-data";

export default function HomePage() {
  const { products, loadingProducts } = useDataContext();
  const heroCategoryLinks = [
    { label: "Woman's Fashion", href: "/categories/womans-fashion" },
    { label: "Men's Fashion", href: "/categories/mens-fashion" },
    { label: "Electronics", href: "/categories/electronics" },
    { label: "Home & Lifestyle", href: "/categories/home-and-lifestyle" },
    { label: "Medicine", href: "/categories/medicine" },
    { label: "Sports & Outdoor", href: "/categories/sports-and-outdoor" },
    { label: "Baby's & Toys", href: "/categories/babys-and-toys" },
    { label: "Groceries & Pets", href: "/categories/groceries-and-pets" },
    { label: "Health & Beauty", href: "/categories/health-and-beauty" }
  ];

  const electronicsProducts = useMemo(
    () => products.filter((product) => product.category === "electronics"),
    [products]
  );

  const mergedItems = useMemo(() => {
    if (loadingProducts || products.length === 0) return storeItems;

    const apparelProducts = products.filter((product) =>
      ["men's clothing", "women's clothing"].includes(product.category)
    );
    const jewelryProducts = products.filter((product) => product.category === "jewelery");

    const pickElectronics = (index: number) => electronicsProducts[index];
    const pickApparel = (index: number) => apparelProducts[index];
    const pickJewelry = (index: number) => jewelryProducts[index];

    return storeItems.map((item, index) => {
      let apiItem = products[index];

      if (item.slug === "havit-hv-g92-gamepad") apiItem = pickElectronics(0) ?? apiItem;
      if (item.slug === "ak-900-wired-keyboard") apiItem = pickElectronics(1) ?? apiItem;
      if (item.slug === "ips-lcd-gaming-monitor")
        apiItem = electronicsProducts.find((p) => p.title.toLowerCase().includes("monitor")) ?? pickElectronics(2) ?? apiItem;
      if (item.slug === "rgb-liquid-cpu-cooler")
        apiItem = pickElectronics(3) ?? apiItem;
      if (item.slug === "the-north-coat") apiItem = pickApparel(0) ?? apiItem;
      if (item.slug === "gucci-duffle-bag") apiItem = pickJewelry(0) ?? apiItem;
      if (item.slug === "wh-1000xm-headphone") return item;
      if (item.slug === "kids-electric-car") apiItem = pickJewelry(1) ?? apiItem;

      if (!apiItem) return item;

      return {
        ...item,
        name: apiItem.title || item.name,
        imageUrl: apiItem.image || item.imageUrl,
        images: apiItem.image ? [apiItem.image, apiItem.image, apiItem.image, apiItem.image] : item.images,
        price: typeof apiItem.price === "number" ? Math.round(apiItem.price * 10) : item.price,
        oldPrice:
          typeof apiItem.price === "number"
            ? Math.round(apiItem.price * 12)
            : item.oldPrice,
        rating: apiItem.rating?.rate ?? item.rating,
        reviews: apiItem.rating?.count ?? item.reviews
      };
    });
  }, [electronicsProducts, loadingProducts, products]);

  const flashSale = mergedItems.slice(0, 4);
  const bestSelling = mergedItems.slice(4, 8);
  const explore = [...mergedItems, ...mergedItems].slice(0, 8);
  const electronicsShowcase = [
    mergedItems.find((item) => item.slug === "havit-hv-g92-gamepad"),
    mergedItems.find((item) => item.slug === "ak-900-wired-keyboard"),
    mergedItems.find((item) => item.slug === "ips-lcd-gaming-monitor"),
    mergedItems.find((item) => item.slug === "rgb-liquid-cpu-cooler")
  ].filter(Boolean);

  const heroProduct = electronicsShowcase[0] ?? mergedItems[0];
  const promoProduct =
    mergedItems.find((item) => item.slug === "wh-1000xm-headphone") ??
    electronicsShowcase[1] ??
    mergedItems[1] ??
    mergedItems[0];
  const featuredMain = electronicsShowcase[2] ?? mergedItems[2] ?? mergedItems[0];
  const featuredTopRight = electronicsShowcase[3] ?? mergedItems[3] ?? mergedItems[1];
  const featuredBottomLeft = mergedItems[4] ?? mergedItems[2];
  const featuredBottomRight = mergedItems[5] ?? mergedItems[3];

  return (
    <div className="space-y-16 pb-8">
      <section id="hero" className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="glass-panel hidden p-4 lg:block">
          <ul className="space-y-3 pt-2 text-sm text-[#210E14]">
            {heroCategoryLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="block transition hover:text-[#F92D0A]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="relative overflow-hidden rounded-2xl border border-[#28323F] bg-[#210E14] p-8 text-white shadow-[0_28px_50px_-26px_rgba(33,14,20,0.84)] md:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full bg-[#FB8500]/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 bottom-0 size-52 rounded-full bg-[#8EB4C2]/20 blur-3xl" />
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <p className="text-sm text-[#8EB4C2]">iPhone 14 Series</p>
              <h1 className="text-5xl font-semibold leading-tight md:text-6xl">Up to 10% off Voucher</h1>
              <Link
                href={`/products/${heroProduct?.slug ?? ""}`}
                className="inline-flex items-center gap-2 text-sm font-semibold underline"
              >
                Shop Now <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="relative h-52 md:h-64">
              <Image
                src={heroProduct?.imageUrl || "/assets/sections/hero-phone.svg"}
                alt={heroProduct?.name || "Hero Product"}
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-center gap-2">
            <span className="size-2 rounded-full bg-white/40" />
            <span className="size-2 rounded-full bg-[#F92D0A]" />
            <span className="size-2 rounded-full bg-white/40" />
            <span className="size-2 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      <section id="flash-sales" className="glass-panel space-y-6 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="section-tag">Today&apos;s</p>
            <h2 className="section-title">Flash Sales</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link href="#hero" className="grid size-9 place-items-center rounded-full bg-[#f5f5f5] text-[#210E14]">
              <ChevronLeft className="size-4" />
            </Link>
            <Link href="#categories" className="grid size-9 place-items-center rounded-full bg-[#f5f5f5] text-[#210E14]">
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {flashSale.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
        <div className="text-center">
          <Link href="/categories/all" className="lava-button inline-flex px-10 py-3">
            View All Products
          </Link>
        </div>
      </section>

      <section id="categories" className="glass-panel space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="section-tag">Categories</p>
            <h2 className="section-title">Browse By Category</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link href="#flash-sales" className="grid size-9 place-items-center rounded-full bg-[#f5f5f5] text-[#210E14]">
              <ChevronLeft className="size-4" />
            </Link>
            <Link href="#best-selling" className="grid size-9 place-items-center rounded-full bg-[#f5f5f5] text-[#210E14]">
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((name, idx) => (
            <Link
              href={`/categories/${toSlug(name)}`}
              key={name}
              className={`grid place-items-center gap-2 rounded border p-5 transition ${
                idx === 3
                  ? "border-[#F92D0A] bg-[#F92D0A] text-white"
                  : "border-[#e5e7eb] bg-white text-[#210E14] hover:border-[#F92D0A]"
              }`}
            >
              {idx === 0 ? <Smartphone /> : null}
              {idx === 1 ? <Laptop /> : null}
              {idx === 2 ? <Smartphone /> : null}
              {idx === 3 ? <Camera /> : null}
              {idx === 4 ? <Headphones /> : null}
              {idx === 5 ? <Gamepad2 /> : null}
              <span className="text-sm font-medium">{name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section id="best-selling" className="glass-panel space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="section-tag">This Month</p>
            <h2 className="section-title">Best Selling Products</h2>
          </div>
          <Link href="/categories/all" className="lava-button inline-flex px-8 py-3">View All</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSelling.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-[#210E14] px-8 py-10 text-white shadow-[0_20px_50px_-30px_rgba(33,14,20,0.8)] md:px-12">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="space-y-4">
            <p className="text-sm text-[#8EB4C2]">Categories</p>
            <h2 className="text-5xl font-semibold leading-tight">Enhance Your Music Experience</h2>
            <div className="flex gap-3 text-black">
              {["23", "05", "59", "35"].map((v) => (
                <div key={v} className="grid size-14 place-items-center rounded-full bg-white text-sm font-semibold">
                  {v}
                </div>
              ))}
            </div>
            <Link href={`/products/${promoProduct?.slug ?? ""}`} className="lava-button inline-flex px-8 py-3">
              Buy Now!
            </Link>
          </div>
          <div className="relative h-56 md:h-72">
            <Image
              src={promoProduct?.imageUrl || "/assets/sections/music-speaker.svg"}
              alt={promoProduct?.name || "Promo Product"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section id="explore-products" className="glass-panel space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="section-tag">Our Products</p>
            <h2 className="section-title">Explore Our Products</h2>
          </div>
          <div className="flex items-center gap-2">
            <Link href="#best-selling" className="grid size-9 place-items-center rounded-full bg-[#f5f5f5] text-[#210E14]">
              <ChevronLeft className="size-4" />
            </Link>
            <Link href="#featured" className="grid size-9 place-items-center rounded-full bg-[#f5f5f5] text-[#210E14]">
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {explore.map((item, idx) => (
            <ProductCard key={`${item.id}-${idx}`} product={item} />
          ))}
        </div>
      </section>

      <section id="featured" className="glass-panel space-y-6 p-6">
        <div className="space-y-2">
          <p className="section-tag">Featured</p>
          <h2 className="section-title">New Arrival</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="group relative min-h-[460px] overflow-hidden rounded-xl bg-black p-6 text-white">
            <Image
              src={featuredMain.imageUrl || "/assets/sections/featured-playstation.svg"}
              alt={featuredMain.name}
              fill
              unoptimized
              className="object-cover opacity-80 transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#210E14]/90 via-[#210E14]/40 to-transparent" />
            <div className="absolute bottom-6 left-6 z-10 space-y-2">
              <h3 className="font-display text-5xl font-semibold leading-none">{featuredMain.name}</h3>
              <p className="max-w-sm text-sm text-zinc-200">
                Premium quality launch drop with limited-time pricing.
              </p>
              <Link href={`/products/${featuredMain.slug}`} className="text-sm font-semibold underline">
                Shop Now
              </Link>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="group relative min-h-[210px] overflow-hidden rounded-xl bg-black p-6 text-white">
              <Image
                src={featuredTopRight.imageUrl || "/assets/sections/featured-women.svg"}
                alt={featuredTopRight.name}
                fill
                unoptimized
                className="object-cover opacity-80 transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#210E14]/85 via-[#210E14]/35 to-transparent" />
              <div className="absolute bottom-6 left-6 z-10 space-y-2">
                <h3 className="font-display text-4xl font-semibold leading-none">
                  {featuredTopRight.name}
                </h3>
                <p className="text-sm text-zinc-200">
                  Featured collection crafted for standout style and utility.
                </p>
                <Link href={`/products/${featuredTopRight.slug}`} className="text-sm font-semibold underline">
                  Shop Now
                </Link>
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <SmallFeature
                title={featuredBottomLeft.name}
                image={featuredBottomLeft.imageUrl || "/assets/sections/featured-speakers.svg"}
                slug={featuredBottomLeft.slug}
              />
              <SmallFeature
                title={featuredBottomRight.name}
                image={featuredBottomRight.imageUrl || "/assets/sections/featured-perfume.svg"}
                slug={featuredBottomRight.slug}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="support" className="glass-panel grid gap-8 p-8 text-center md:grid-cols-3">
        <FeatureIcon icon={<Truck className="size-5" />} title="FREE AND FAST DELIVERY" copy="Free delivery for all orders over $140" />
        <FeatureIcon icon={<Headset className="size-5" />} title="24/7 CUSTOMER SERVICE" copy="Friendly 24/7 customer support" />
        <FeatureIcon icon={<ShieldCheck className="size-5" />} title="MONEY BACK GUARANTEE" copy="We return money within 30 days" />
      </section>
    </div>
  );
}

function SmallFeature({ title, image, slug }: { title: string; image: string; slug: string }) {
  return (
    <div className="group relative min-h-[220px] overflow-hidden rounded-xl bg-black p-5 text-white">
      <Image src={image} alt={title} fill unoptimized className="object-cover opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#210E14]/85 via-[#210E14]/35 to-transparent" />
      <div className="absolute bottom-5 left-5 z-10 space-y-2">
        <h4 className="font-display text-4xl font-semibold leading-none">{title}</h4>
        <Link href={`/products/${slug}`} className="text-sm font-semibold underline">
          Shop Now
        </Link>
      </div>
    </div>
  );
}

function FeatureIcon({ icon, title, copy }: { icon: ReactNode; title: string; copy: string }) {
  return (
    <div className="space-y-2">
      <div className="mx-auto icon-circle">{icon}</div>
      <h4 className="text-lg font-semibold text-[#210E14]">{title}</h4>
      <p className="text-sm text-zinc-500">{copy}</p>
    </div>
  );
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replaceAll("&", "and")
    .replaceAll("'", "")
    .replaceAll(/\s+/g, "-");
}
