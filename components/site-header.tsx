"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useMemo, useState, useSyncExternalStore } from "react";
import { ChevronDown, Heart, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { useDataContext } from "@/components/data-context";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import type { CatalogProduct } from "@/lib/catalog";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
  { href: "/account", label: "Sign Up" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const cart = useCart();
  const wishlist = useWishlist();
  const { products } = useDataContext();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  const searchProducts = useMemo(() => products.slice(0, 120), [products]);
  const [desktopQuery, setDesktopQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");

  return (
    <header className="fixed inset-x-0 top-0 z-[70] border-b border-[#d2d8df] bg-white/85 shadow-[0_18px_40px_-26px_rgba(33,14,20,0.88)] backdrop-blur-lg">
      <div className="bg-gradient-to-r from-[#210E14] via-[#28323F] to-[#210E14] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 text-[10px] sm:px-4 sm:text-[11px] md:px-6">
          <p className="w-full text-center leading-tight md:w-auto">
            Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
            <Link href="/" className="font-semibold underline">
              ShopNow
            </Link>
          </p>
          <button className="hidden items-center gap-1 rounded-full border border-white/30 bg-white/10 px-2.5 py-1 text-xs transition hover:bg-white/20 md:flex">
            English <ChevronDown className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-4 md:gap-4 md:px-6 md:py-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-[#d9e0e7] bg-white/90 p-1.5 shadow-[0_12px_26px_-18px_rgba(33,14,20,0.8)] md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-[#28323F] transition-all duration-300 hover:bg-[#FB8500]/15 hover:text-[#210E14]",
                pathname === item.href && "bg-gradient-to-r from-[#FB8500] to-[#F92D0A] text-white shadow-[0_12px_20px_-12px_rgba(249,45,10,0.9)] hover:text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <SearchBox
            id="desktop-site-search"
            query={desktopQuery}
            setQuery={setDesktopQuery}
            products={searchProducts}
            placeholder="What are you looking for?"
            className="hidden md:flex"
          />
          <IconWrap icon={<Heart className="size-5" />} badge={hydrated ? wishlist.count : 0} href="/wishlist" flyTarget="wishlist" />
          <IconWrap icon={<ShoppingCart className="size-5" />} badge={hydrated ? cartCount : 0} href="/cart" flyTarget="cart" />
          <IconWrap icon={<User className="size-5" />} href="/account" />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-3 pb-3 sm:px-4 md:hidden">
        <SearchBox
          id="mobile-site-search"
          query={mobileQuery}
          setQuery={setMobileQuery}
          products={searchProducts}
          placeholder="Search products..."
          className="mb-2"
        />
        <nav className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-full border border-[#d9e0e7] bg-white px-4 py-1.5 text-xs font-semibold text-[#28323F] transition",
                pathname === item.href && "border-transparent bg-gradient-to-r from-[#FB8500] to-[#F92D0A] text-white"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

function SearchBox({
  id,
  query,
  setQuery,
  products,
  placeholder,
  className
}: {
  id: string;
  query: string;
  setQuery: (value: string) => void;
  products: CatalogProduct[];
  placeholder: string;
  className?: string;
}) {
  const router = useRouter();
  const results = useMemo(() => getRelatedProducts(products, query, 6), [products, query]);
  const showDropdown = query.trim().length > 0;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const first = results[0];
    if (first) {
      setQuery("");
      router.push(`/products/${first.slug}`);
    }
  }

  return (
    <form
      role="search"
      aria-label="Site search"
      onSubmit={onSubmit}
      className={cn(
        "relative items-center gap-2 rounded-full border border-[#d9e0e7] bg-white px-3 py-2 shadow-[0_14px_22px_-18px_rgba(40,50,63,0.75)]",
        className,
        className?.includes("hidden") ? "" : "flex"
      )}
    >
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
        className="w-full bg-transparent text-sm text-[#210E14] caret-[#F92D0A] outline-none placeholder:text-[#9ca3af] md:w-40"
        placeholder={placeholder}
      />
      <button
        type="submit"
        className="grid size-7 shrink-0 place-items-center rounded-full bg-gradient-to-r from-[#FB8500] to-[#F92D0A] text-white"
        aria-label="Search"
      >
        <Search className="size-3.5" />
      </button>

      {showDropdown ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[95] overflow-hidden rounded-xl border border-[#d9e0e7] bg-white shadow-[0_24px_34px_-26px_rgba(33,14,20,0.9)]">
          {results.length > 0 ? (
            <ul className="max-h-72 overflow-auto py-1">
              {results.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={() => setQuery("")}
                    className="block px-3 py-2 text-sm text-[#210E14] transition hover:bg-[#FB8500]/10"
                  >
                    <p className="line-clamp-1 font-medium">{item.name}</p>
                    <p className="line-clamp-1 text-xs text-[#748692]">{item.category}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-2 text-sm text-[#748692]">No related products found.</p>
          )}
        </div>
      ) : null}
    </form>
  );
}

function getRelatedProducts(products: CatalogProduct[], query: string, limit = 6) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const terms = q.split(/\s+/).filter(Boolean);

  const scored = products
    .map((item) => {
      const name = item.name.toLowerCase();
      const category = item.category.toLowerCase();
      const description = item.description.toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (name === term) score += 120;
        if (name.startsWith(term)) score += 90;
        if (name.split(/[^a-z0-9]+/).some((w) => w.startsWith(term))) score += 70;
        if (name.includes(term)) score += 50;
        if (category.startsWith(term)) score += 30;
        if (category.includes(term)) score += 20;
        if (description.includes(term)) score += 10;
      }

      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));

  return scored.slice(0, limit).map((entry) => entry.item);
}

function IconWrap({
  icon,
  badge,
  href,
  flyTarget
}: {
  icon: ReactNode;
  badge?: number;
  href?: string;
  flyTarget?: "wishlist" | "cart";
}) {
  const content = (
    <span
      data-fly-target={flyTarget}
      className="relative inline-flex size-9 items-center justify-center rounded-full border border-[#d7dee6] bg-white text-[#28323F] shadow-[0_10px_16px_-14px_rgba(33,14,20,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FB8500] hover:bg-gradient-to-r hover:from-[#FB8500] hover:to-[#F92D0A] hover:text-white md:size-10"
    >
      {icon}
      {typeof badge === "number" ? (
        <span className="absolute -right-1.5 -top-1.5 inline-flex size-4 items-center justify-center rounded-full bg-gradient-to-r from-[#FB8500] to-[#F92D0A] text-[10px] font-bold text-white shadow">
          {badge}
        </span>
      ) : null}
    </span>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
