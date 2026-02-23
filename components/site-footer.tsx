import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, SendHorizontal, Twitter } from "lucide-react";
import { ReactNode } from "react";

export function SiteFooter() {
  const profileUrl = "https://portfolio-next16.vercel.app/";
  const googlePlayUrl = "https://play.google.com/store";
  const appStoreUrl = "https://www.apple.com/app-store/";
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=512x512&margin=4&data=${encodeURIComponent(profileUrl)}`;

  return (
    <footer className="mt-24 border-t border-[#28323F] bg-[radial-gradient(circle_at_20%_5%,rgba(251,133,0,0.18),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(142,180,194,0.12),transparent_32%),linear-gradient(180deg,#07090d_0%,#050607_100%)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-5 md:px-6">
        <div className="space-y-3">
          <p className="font-display text-[2rem] font-bold leading-none text-white">StackStore</p>
          <p className="text-[1.55rem] font-semibold leading-none">Subscribe</p>
          <p className="text-sm text-zinc-300">Get 10% off your first order</p>
          <div className="flex h-11 items-center justify-between rounded border border-[#748692] bg-black/25 px-3 transition focus-within:border-[#FB8500]">
            <input
              id="footer-subscribe-email"
              name="email"
              autoComplete="email"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
              placeholder="Enter your email"
            />
            <SendHorizontal className="size-4 text-[#FB8500]" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[1.55rem] font-semibold leading-none">Support</p>
          <p className="text-sm text-zinc-300">111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
          <p className="text-sm text-zinc-300">mdqamrul74@gmail.com</p>
          <p className="text-sm text-zinc-300">+88015-88888-9999</p>
        </div>

        <div className="space-y-3">
          <p className="text-[1.55rem] font-semibold leading-none">Account</p>
          <FooterLink href="/account">My Account</FooterLink>
          <FooterLink href="/account">Login / Register</FooterLink>
          <FooterLink href="/cart">Cart</FooterLink>
          <FooterLink href="/wishlist">Wishlist</FooterLink>
          <FooterLink href="/">Shop</FooterLink>
        </div>

        <div className="space-y-3">
          <p className="text-[1.55rem] font-semibold leading-none">Quick Link</p>
          <FooterLink href="/policies/privacy">Privacy Policy</FooterLink>
          <FooterLink href="/policies/terms">Terms Of Use</FooterLink>
          <FooterLink href="/policies/refund">Refund Policy</FooterLink>
          <FooterLink href="/policies/shipping">Shipping Policy</FooterLink>
          <FooterLink href="/policies/cookies">Cookie Policy</FooterLink>
          <FooterLink href="/faq">FAQ</FooterLink>
          <FooterLink href="/reviews">Reviews</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </div>

        <div className="space-y-3">
          <p className="text-[1.55rem] font-semibold leading-none">Download App</p>
          <p className="text-xs text-[#748692]">Scan to open your profile page</p>
          <div className="grid grid-cols-[112px_52px] items-start gap-2">
            <a
              href={profileUrl}
              className="grid h-[112px] w-[112px] place-items-center overflow-hidden rounded border border-[#748692] bg-white"
              aria-label="Open profile page"
            >
              <Image
                src={qrCodeUrl}
                alt="QR code to profile page"
                width={104}
                height={104}
                className="h-[104px] w-[104px] object-contain"
                loading="lazy"
                unoptimized
                referrerPolicy="no-referrer"
              />
            </a>
            <div className="grid h-[112px] content-between">
              <a
                href={googlePlayUrl}
                aria-label="Open Google Play profile link"
                className="grid h-[52px] w-[52px] place-items-center rounded-md border border-[#748692] bg-black/25 transition hover:border-[#FB8500]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/assets/sections/google-play-icon.svg?v=2"
                  alt="Google Play icon"
                  width={28}
                  height={28}
                  className="h-[28px] w-[28px]"
                />
              </a>
              <a
                href={appStoreUrl}
                aria-label="Open App Store profile link"
                className="grid h-[52px] w-[52px] place-items-center rounded-md border border-[#748692] bg-black/25 transition hover:border-[#FB8500]"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/assets/sections/app-store-icon.svg?v=3"
                  alt="App Store icon"
                  width={28}
                  height={28}
                  className="h-[28px] w-[28px]"
                />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2 text-zinc-300">
            <FooterIcon icon={<Facebook className="size-5" />} />
            <FooterIcon icon={<Twitter className="size-5" />} />
            <FooterIcon icon={<Instagram className="size-5" />} />
            <FooterIcon icon={<Linkedin className="size-5" />} />
          </div>
        </div>
      </div>

      <div className="border-t border-[#28323F]">
        <div className="mx-auto flex max-w-6xl justify-center px-4 py-4 text-sm text-[#748692] md:px-6">
          <p>© Copyright Qamrul Hassan Shajal 2026. All right reserved</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="block text-sm text-zinc-300 transition hover:text-[#FB8500]">
      {children}
    </Link>
  );
}

function FooterIcon({ icon }: { icon: ReactNode }) {
  return (
    <span className="grid size-8 place-items-center rounded-full border border-[#28323F] bg-black/30 text-[#8EB4C2] transition hover:-translate-y-0.5 hover:border-[#F92D0A] hover:text-white">
      {icon}
    </span>
  );
}


