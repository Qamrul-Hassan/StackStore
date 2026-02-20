import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about StackStore, our story, team, and service values.",
  alternates: { canonical: "/about" }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

