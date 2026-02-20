import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact StackStore support for orders, products, and general assistance.",
  alternates: { canonical: "/contact" }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

