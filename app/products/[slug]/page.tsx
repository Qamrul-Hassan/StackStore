import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailsInteractive } from "@/components/product-details-interactive";
import { ProductCard } from "@/components/product-card";
import { fetchCatalogProducts, formatCategory } from "@/lib/catalog";

export default async function ProductDetailsPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await fetchCatalogProducts();
  const product = products.find((item) => item.slug === slug);

  if (!product) return notFound();

  const related = products
    .filter((item) => item.slug !== product.slug && item.category === product.category)
    .slice(0, 4);

  const description =
    product.description ||
    `${product.name} is built with premium materials and practical details for reliable daily performance.`;

  return (
    <div className="space-y-14 pb-8">
      <p className="text-sm text-zinc-500">
        Home / {formatCategory(product.category)} / <span className="text-[#210E14]">{product.name}</span>
      </p>

      <ProductDetailsInteractive
        product={{
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl
        }}
        description={description}
        reviews={product.reviews}
        gallery={product.images}
        optionGroups={getOptionGroups(product.category)}
      />

      <section className="space-y-6">
        <p className="section-tag">Related Item</p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <Link href="/" className="inline-block text-sm text-[#F92D0A] underline">
        Back to home
      </Link>
    </div>
  );
}

function getOptionGroups(category: string) {
  const value = category.toLowerCase();

  if (value.includes("smartphone") || value.includes("mobile")) {
    return [
      { label: "Storage", options: ["128GB", "256GB", "512GB"] },
      { label: "Color", options: ["Graphite", "Silver", "Sunset"] }
    ];
  }

  if (value.includes("laptop") || value.includes("computer")) {
    return [
      { label: "RAM", options: ["8GB", "16GB", "32GB"] },
      { label: "SSD", options: ["256GB", "512GB", "1TB"] }
    ];
  }

  if (value.includes("skin") || value.includes("beauty")) {
    return [
      { label: "Size", options: ["50ml", "100ml", "150ml"] },
      { label: "Type", options: ["Normal", "Dry", "Sensitive"] }
    ];
  }

  return [
    { label: "Variant", options: ["Standard", "Premium"] },
    { label: "Delivery", options: ["Express", "Next Day"] }
  ];
}
