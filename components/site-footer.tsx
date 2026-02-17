import Link from "next/link";
import { Facebook, Instagram, Linkedin, SendHorizontal, Twitter } from "lucide-react";
import { ReactNode } from "react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-[#28323F] bg-[radial-gradient(circle_at_20%_5%,rgba(251,133,0,0.18),transparent_35%),radial-gradient(circle_at_85%_0%,rgba(142,180,194,0.12),transparent_32%),linear-gradient(180deg,#07090d_0%,#050607_100%)] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-5 md:px-6">
        <div className="space-y-3">
          <p className="font-display text-[2rem] font-bold leading-none text-white">StackStore</p>
          <p className="text-[1.55rem] font-semibold leading-none">Subscribe</p>
          <p className="text-sm text-zinc-300">Get 10% off your first order</p>
          <div className="flex h-11 items-center justify-between rounded border border-[#748692] bg-black/25 px-3 transition focus-within:border-[#FB8500]">
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-500"
              placeholder="Enter your email"
            />
            <SendHorizontal className="size-4 text-[#FB8500]" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[1.55rem] font-semibold leading-none">Support</p>
          <p className="text-sm text-zinc-300">111 Bijoy sarani, Dhaka, DH 1515, Bangladesh.</p>
          <p className="text-sm text-zinc-300">exclusive@gmail.com</p>
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
          <FooterLink href="/">Privacy Policy</FooterLink>
          <FooterLink href="/">Terms Of Use</FooterLink>
          <FooterLink href="/">FAQ</FooterLink>
          <FooterLink href="/contact">Contact</FooterLink>
        </div>

        <div className="space-y-3">
          <p className="text-[1.55rem] font-semibold leading-none">Download App</p>
          <p className="text-xs text-[#748692]">Save $3 with App New User Only</p>
          <div className="grid grid-cols-[84px_1fr] gap-2">
            <div className="grid place-items-center rounded border border-[#748692] text-xs text-[#748692]">QR</div>
            <div className="space-y-2">
              <div className="rounded border border-[#748692] bg-black/25 px-3 py-2 text-xs text-zinc-300 transition hover:border-[#FB8500]">
                Google Play
              </div>
              <div className="rounded border border-[#748692] bg-black/25 px-3 py-2 text-xs text-zinc-300 transition hover:border-[#FB8500]">
                App Store
              </div>
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
          <p>© Copyright RimeI 2022. All right reserved</p>
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
