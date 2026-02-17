import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { categories, storeItems } from "@/lib/store-data";

const categoryMap: Record<string, string[]> = {
  all: [],
  "woman-fashion": ["coat", "jacket", "bag"],
  "womans-fashion": ["coat", "jacket", "bag"],
  "mens-fashion": ["coat", "jacket"],
  electronics: ["monitor", "keyboard", "cooler", "gamepad", "headphone"],
  "home-and-lifestyle": ["bookself", "bookshelf"],
  medicine: [],
  "sports-and-outdoor": ["gamepad"],
  "babys-and-toys": ["kids-electric-car", "car"],
  "groceries-and-pets": [],
  "health-and-beauty": [],
  phones: [],
  computers: ["monitor", "keyboard", "cooler", "headphone"],
  smartwatch: [],
  camera: [],
  headphone: ["headphone"],
  gaming: ["gamepad", "keyboard", "monitor"]
};

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalized = slug.toLowerCase();

  if (!categoryMap[normalized] && normalized !== "all") {
    return notFound();
  }

  const keywords = categoryMap[normalized] ?? [];
  const items =
    normalized === "all"
      ? storeItems
      : storeItems.filter((item) => keywords.some((word) => item.slug.includes(word)));

  const pageTitle = readable(normalized);

  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-500">
        Home / Categories / <span className="text-[#210E14]">{pageTitle}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Link href="/categories/all" className="rounded-md border border-[#dce3ea] bg-white px-3 py-1.5 text-sm text-[#210E14] hover:border-[#F92D0A] hover:text-[#F92D0A]">
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category}
            href={`/categories/${toSlug(category)}`}
            className="rounded-md border border-[#dce3ea] bg-white px-3 py-1.5 text-sm text-[#210E14] transition hover:border-[#F92D0A] hover:text-[#F92D0A]"
          >
            {category}
          </Link>
        ))}
      </div>

      <h1 className="section-title">{pageTitle}</h1>

      {items.length === 0 ? (
        <div className="glass-panel p-8 text-sm text-zinc-600">
          Products for this category are coming soon.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function readable(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replaceAll("&", "and")
    .replaceAll("'", "")
    .replaceAll(/\s+/g, "-");
}
