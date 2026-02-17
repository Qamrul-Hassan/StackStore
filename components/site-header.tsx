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
    <header className="sticky top-0 z-40 border-b border-[#cfd8e3] bg-white/85 shadow-[0_12px_30px_-24px_rgba(33,14,20,0.9)] backdrop-blur-lg">
      <div className="bg-gradient-to-r from-[#210E14] via-[#28323F] to-[#210E14] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2 text-[11px] md:px-6">
          <p className="text-center w-full md:w-auto">
            Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%!{" "}
            <Link href="/" className="font-semibold underline">
              ShopNow
            </Link>
          </p>
          <button className="hidden items-center gap-1 text-xs md:flex">
            English <ChevronDown className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 text-base md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "border-b-2 border-transparent pb-1 text-[#28323F] transition-all duration-300 hover:border-[#FB8500] hover:text-[#F92D0A]",
                pathname === item.href && "border-[#F92D0A] text-[#210E14]"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-lg border border-[#cfd8e3] bg-white px-3 py-2 shadow-[0_14px_22px_-18px_rgba(40,50,63,0.75)] md:flex">
            <input
              className="w-40 bg-transparent text-sm outline-none placeholder:text-[#9ca3af]"
              placeholder="What are you looking for?"
            />
            <Search className="size-4 text-[#28323F]" />
          </div>
          <IconWrap icon={<Heart className="size-5" />} badge={wishlist.count} href="/wishlist" />
          <IconWrap icon={<ShoppingCart className="size-5" />} badge={cartCount} href="/cart" />
          <IconWrap icon={<User className="size-5" />} href="/account" />
        </div>
      </div>
    </header>
  );
}

function IconWrap({
  icon,
  badge,
  href
}: {
  icon: ReactNode;
  badge?: number;
  href?: string;
}) {
  const content = (
    <span className="relative inline-flex size-9 items-center justify-center rounded-full border border-[#d7dee6] bg-white text-[#28323F] shadow-[0_10px_16px_-14px_rgba(33,14,20,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#FB8500] hover:text-[#F92D0A]">
      {icon}
      {badge && badge > 0 ? (
        <span className="absolute -right-1.5 -top-1.5 inline-flex size-4 items-center justify-center rounded-full bg-gradient-to-r from-[#FB8500] to-[#F92D0A] text-[10px] font-bold text-white shadow">
          {badge}
        </span>
      ) : null}
    </span>
  );

  if (href) return <Link href={href}>{content}</Link>;
  return content;
}
