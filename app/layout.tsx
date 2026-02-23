import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { Providers } from "@/app/providers";
import { BrandShowcase } from "@/components/brand-showcase";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteUrl } from "@/lib/seo";
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
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "StackStore | Next Commerce",
    template: "%s | StackStore"
  },
  description: "Bold, premium e-commerce storefront powered by Next.js",
  keywords: [
    "StackStore",
    "ecommerce",
    "online shopping",
    "next.js store",
    "electronics",
    "fashion"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "StackStore",
    title: "StackStore | Next Commerce",
    description: "Bold, premium e-commerce storefront powered by Next.js"
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg"
  },
  twitter: {
    card: "summary_large_image",
    title: "StackStore | Next Commerce",
    description: "Bold, premium e-commerce storefront powered by Next.js"
  }
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
          <main
            className="relative main-cart-bg mx-auto max-w-6xl overflow-x-clip px-4 pb-8 pt-0 md:px-6"
            style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))" }}
          >
            {children}
          </main>
          <BrandShowcase />
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
