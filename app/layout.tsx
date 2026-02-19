import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { Providers } from "@/app/providers";
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
          <main className="relative main-cart-bg mx-auto max-w-6xl px-4 pb-8 pt-[170px] md:pt-[112px] md:px-6">
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
