import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { Providers } from "@/app/providers";
import { BrandShowcase } from "@/components/brand-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-body"
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-heading"
});

export const metadata: Metadata = {
  title: "StackStore",
  description: "Bold, premium e-commerce storefront powered by Next.js"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${outfit.variable} ${syne.variable}`}>
        <Providers>
          <SiteHeader />
          <div aria-hidden className="h-[190px] md:h-[132px]" />
          <main className="relative main-cart-bg mx-auto max-w-6xl px-4 pb-8 pt-0 md:px-6">
            {children}
          </main>
          <BrandShowcase />
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
