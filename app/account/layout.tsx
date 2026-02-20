import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your StackStore profile, address book, and account settings.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false }
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}

