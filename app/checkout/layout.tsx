import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout for your StackStore order.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false }
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

