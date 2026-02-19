import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { extractCategories, fetchCatalogProducts, formatCategory, toCategorySlug } from "@/lib/catalog";

const CATEGORY_ALIAS: Record<string, string[]> = {
  "womans-fashion": ["womens-dresses", "womens-shoes", "womens-watches", "tops", "womens-bags", "womens-jewellery"],
  "mens-fashion": ["mens-shirts", "mens-shoes", "mens-watches"],
  electronics: ["smartphones", "laptops", "tablets", "mobile-accessories"],
  "home-and-lifestyle": ["home-decoration", "furniture", "kitchen-accessories"],
  medicine: ["skin-care"],
  "sports-and-outdoor": ["sports-accessories", "motorcycle"],
  "babys-and-toys": ["vehicle"],
  "groceries-and-pets": ["groceries"],
  "health-and-beauty": ["beauty", "fragrances", "skin-care"]
};

export default async function CategoryPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalized = slug.toLowerCase();
  const products = await fetchCatalogProducts();
  const categories = extractCategories(products);
  const categorySlugs = categories.map((category) => toCategorySlug(category));
  const aliasTargets = CATEGORY_ALIAS[normalized];

  const items =
    normalized === "all"
      ? products
      : aliasTargets
        ? products.filter((item) => aliasTargets.includes(toCategorySlug(item.category)))
        : products.filter((item) => toCategorySlug(item.category) === normalized);
  const sortedItems =
    normalized === "electronics"
      ? [...items].sort((a, b) => {
          const aPhone = toCategorySlug(a.category) === "smartphones" ? 0 : 1;
          const bPhone = toCategorySlug(b.category) === "smartphones" ? 0 : 1;
          return aPhone - bPhone;
        })
      : items;

  if (
    normalized !== "all" &&
    !categorySlugs.includes(normalized) &&
    !CATEGORY_ALIAS[normalized]
  ) {
    return notFound();
  }

  const pageTitle = normalized === "all" ? "All Products" : readableCategoryTitle(normalized, items[0]?.category);
  const primaryCategoryLinks = [
    { label: "Women's Fashion", slug: "womans-fashion" },
    { label: "Men's Fashion", slug: "mens-fashion" },
    { label: "Electronics", slug: "electronics" },
    { label: "Home & Lifestyle", slug: "home-and-lifestyle" },
    { label: "Health & Beauty", slug: "health-and-beauty" }
  ];

  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-500">
        Home / Categories / <span className="text-[#210E14]">{pageTitle}</span>
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <Link href="/categories/all" className="rounded-md border border-[#dce3ea] bg-white px-3 py-1.5 text-sm text-[#210E14] hover:border-[#F92D0A] hover:text-[#F92D0A]">
          All
        </Link>
        {primaryCategoryLinks.map((entry) => (
          <Link
            key={entry.slug}
            href={`/categories/${entry.slug}`}
            className="rounded-md border border-[#dce3ea] bg-white px-3 py-1.5 text-sm text-[#210E14] transition hover:border-[#F92D0A] hover:text-[#F92D0A]"
          >
            {entry.label}
          </Link>
        ))}
        {categories.slice(0, 14).map((category) => (
          <Link
            key={category}
            href={`/categories/${toCategorySlug(category)}`}
            className="rounded-md border border-[#dce3ea] bg-white px-3 py-1.5 text-sm text-[#210E14] transition hover:border-[#F92D0A] hover:text-[#F92D0A]"
          >
            {formatCategory(category)}
          </Link>
        ))}
      </div>

      <h1 className="section-title !text-white">{pageTitle}</h1>

      {sortedItems.length === 0 ? (
        <div className="glass-panel p-8 text-sm text-zinc-600">
          Products for this category are coming soon.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sortedItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function readableCategoryTitle(slug: string, category?: string) {
  const titleMap: Record<string, string> = {
    "womans-fashion": "Woman's Fashion",
    "mens-fashion": "Men's Fashion",
    electronics: "Electronics",
    "home-and-lifestyle": "Home & Lifestyle",
    medicine: "Medicine",
    "sports-and-outdoor": "Sports & Outdoor",
    "babys-and-toys": "Baby's & Toys",
    "groceries-and-pets": "Groceries & Pets",
    "health-and-beauty": "Health & Beauty"
  };
  if (titleMap[slug]) return titleMap[slug];
  return formatCategory(category ?? slug);
}
