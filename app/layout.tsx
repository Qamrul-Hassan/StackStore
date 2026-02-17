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
          <main className="relative mx-auto max-w-6xl px-4 py-8 md:px-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_50%_0%,rgba(251,133,0,0.18),rgba(249,45,10,0.06)_42%,transparent_70%)]" />
            {children}
          </main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
