import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductDetailsInteractive } from "@/components/product-details-interactive";
import { ProductCard } from "@/components/product-card";
import { db } from "@/lib/db";
import { demoProducts } from "@/lib/demo-products";
import { toProductDTO } from "@/lib/serializers";
import { storeItems } from "@/lib/store-data";

export default async function ProductDetailsPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let mapped = demoProducts.find((p) => p.slug === slug);

  try {
    const product = await db.product.findFirst({
      where: { slug, isActive: true }
    });
    if (product) mapped = toProductDTO(product);
  } catch {
    // keep fallback
  }

  if (!mapped) {
    const fromStore = storeItems.find((i) => i.slug === slug);
    if (!fromStore) return notFound();
    mapped = {
      id: fromStore.id,
      slug: fromStore.slug,
      name: fromStore.name,
      description: "Premium quality product with reliable materials and daily-use durability.",
      imageUrl: fromStore.imageUrl,
      price: fromStore.price,
      stock: 30,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  const details = getProductDetails(mapped.slug, mapped.name);
  const related = storeItems.filter((item) => item.slug !== mapped.slug).slice(0, 4);
  const gallery = getProductGallery(mapped.slug, mapped.imageUrl);

  return (
    <div className="space-y-14 pb-8">
      <p className="text-sm text-zinc-500">
        Home / {details.breadcrumb} / <span className="text-[#210E14]">{mapped.name}</span>
      </p>

      <ProductDetailsInteractive
        product={{
          id: mapped.id,
          name: mapped.name,
          price: mapped.price,
          imageUrl: mapped.imageUrl
        }}
        description={details.description}
        reviews={details.reviews}
        gallery={gallery}
        optionGroups={details.optionGroups}
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

type OptionGroup = { label: string; options: string[] };

function getProductDetails(
  slug: string,
  name: string
): {
  breadcrumb: string;
  reviews: number;
  description: string;
  optionGroups: OptionGroup[];
} {
  if (slug.includes("gamepad") || slug.includes("controller")) {
    return {
      breadcrumb: "Gaming",
      reviews: 150,
      description:
        "Low-latency precision controller with textured grips, responsive triggers, and broad platform compatibility for serious gameplay.",
      optionGroups: [
        { label: "Platform", options: ["PC", "PS5", "Xbox"] },
        { label: "Edition", options: ["Standard", "Pro"] }
      ]
    };
  }

  if (slug.includes("keyboard")) {
    return {
      breadcrumb: "Computers",
      reviews: 128,
      description:
        "Mechanical keyboard built for speed and durability with customizable lighting, tactile feedback, and stable keystrokes.",
      optionGroups: [
        { label: "Layout", options: ["TKL", "75%", "Full"] },
        { label: "Switch", options: ["Red", "Brown", "Blue"] }
      ]
    };
  }

  if (slug.includes("monitor")) {
    return {
      breadcrumb: "Computers",
      reviews: 99,
      description:
        "High-refresh IPS display tuned for gaming and creative workflows, delivering sharp visuals and consistent color accuracy.",
      optionGroups: [
        { label: "Screen Size", options: ["24 inch", "27 inch", "32 inch"] },
        { label: "Refresh Rate", options: ["144Hz", "165Hz", "240Hz"] }
      ]
    };
  }

  if (slug.includes("cooler")) {
    return {
      breadcrumb: "Computers",
      reviews: 65,
      description:
        "Efficient cooling system with optimized airflow and low-noise performance to keep your rig stable under load.",
      optionGroups: [
        { label: "Radiator", options: ["240mm", "360mm"] },
        { label: "RGB", options: ["ARGB", "Static"] }
      ]
    };
  }

  if (slug.includes("headphone")) {
    return {
      breadcrumb: "Electronics",
      reviews: 182,
      description:
        "Noise-canceling premium headphone with balanced studio-grade audio, long battery life, and ultra-comfort cushions.",
      optionGroups: [
        { label: "Color", options: ["Black", "Blue", "Sunset"] },
        { label: "Connection", options: ["Bluetooth", "Wired"] }
      ]
    };
  }

  if (slug.includes("jacket") || slug.includes("coat")) {
    return {
      breadcrumb: "Fashion",
      reviews: 65,
      description:
        "Premium outerwear designed for comfort and layered styling with durable fabric and everyday versatility.",
      optionGroups: [
        { label: "Size", options: ["XS", "S", "M", "L", "XL"] },
        { label: "Fit", options: ["Regular", "Oversized"] }
      ]
    };
  }

  if (slug.includes("bag")) {
    return {
      breadcrumb: "Fashion",
      reviews: 65,
      description:
        "Structured travel-ready bag crafted with durable material, spacious compartments, and polished detailing.",
      optionGroups: [
        { label: "Capacity", options: ["28L", "36L", "42L"] },
        { label: "Material", options: ["Leather", "Canvas"] }
      ]
    };
  }

  if (slug.includes("bookself") || slug.includes("bookshelf")) {
    return {
      breadcrumb: "Home",
      reviews: 65,
      description:
        "Contemporary storage piece with clean geometry and sturdy build, ideal for books, decor, and daily essentials.",
      optionGroups: [
        { label: "Height", options: ["120cm", "160cm", "200cm"] },
        { label: "Finish", options: ["Oak", "Walnut"] }
      ]
    };
  }

  if (slug.includes("car")) {
    return {
      breadcrumb: "Toys",
      reviews: 65,
      description:
        "Fun electric ride-on with smooth controls and safe construction, designed for playful everyday adventures.",
      optionGroups: [
        { label: "Battery", options: ["12V", "24V"] },
        { label: "Age", options: ["3-5", "6-8"] }
      ]
    };
  }

  return {
    breadcrumb: "Product",
    reviews: 100,
    description: `${name} is built with premium materials and practical details for reliable daily performance.`,
    optionGroups: [{ label: "Variant", options: ["Standard", "Premium"] }]
  };
}

function getProductGallery(slug: string, fallback: string) {
  const storeImage = storeItems.find((item) => item.slug === slug)?.imageUrl;
  const image = storeImage ?? fallback;
  return [
    image,
    image,
    image,
    image
  ];
}
