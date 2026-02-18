"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { ChevronDown, Heart, Search, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

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
  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-[#d2d8df] bg-white/85 shadow-[0_18px_40px_-26px_rgba(33,14,20,0.88)] backdrop-blur-lg">
      <div className="bg-gradient-to-r from-[#210E14] via-[#28323F] to-[#210E14] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-[11px] md:px-6">
          <p className="w-full text-center md:w-auto">
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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
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
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-full border border-[#d9e0e7] bg-white px-3 py-2 shadow-[0_14px_22px_-18px_rgba(40,50,63,0.75)] md:flex">
            <input
              className="w-40 bg-transparent text-sm outline-none placeholder:text-[#9ca3af]"
              placeholder="What are you looking for?"
            />
            <button
              type="button"
              className="grid size-7 place-items-center rounded-full bg-gradient-to-r from-[#FB8500] to-[#F92D0A] text-white"
              aria-label="Search"
            >
              <Search className="size-3.5" />
            </button>
          </div>
          <IconWrap icon={<Heart className="size-5" />} badge={wishlist.count} href="/wishlist" flyTarget="wishlist" />
          <IconWrap icon={<ShoppingCart className="size-5" />} badge={cartCount} href="/cart" flyTarget="cart" />
          <IconWrap icon={<User className="size-5" />} href="/account" />
        </div>
      </div>
    </header>
  );
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
      className="relative inline-flex size-10 items-center justify-center rounded-full border border-[#d7dee6] bg-white text-[#28323F] shadow-[0_10px_16px_-14px_rgba(33,14,20,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FB8500] hover:bg-gradient-to-r hover:from-[#FB8500] hover:to-[#F92D0A] hover:text-white"
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
