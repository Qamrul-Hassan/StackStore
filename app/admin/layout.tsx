import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "StackStore admin management area.",
  alternates: { canonical: "/admin" },
  robots: { index: false, follow: false }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}

