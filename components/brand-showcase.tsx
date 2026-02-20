import Image from "next/image";
import Link from "next/link";

const brands = [
  {
    name: "Nike",
    href: "/categories/mens-shoes",
    logo: "https://cdn.simpleicons.org/nike/ffffff",
    glow: "from-[#ff8a00]/35 to-[#ff2f00]/10"
  },
  {
    name: "Adidas",
    href: "/categories/mens-shoes",
    logo: "https://cdn.simpleicons.org/adidas/ffffff",
    glow: "from-[#8EB4C2]/30 to-[#1f2a3a]/10"
  },
  {
    name: "Puma",
    href: "/categories/sports-accessories",
    logo: "https://cdn.simpleicons.org/puma/ffffff",
    glow: "from-[#f92d0a]/35 to-[#210E14]/10"
  },
  {
    name: "Apple",
    href: "/categories/smartphones",
    logo: "https://cdn.simpleicons.org/apple/ffffff",
    glow: "from-[#d8e0ea]/28 to-[#7a8ea8]/10"
  },
  {
    name: "Samsung",
    href: "/categories/smartphones",
    logo: "https://cdn.simpleicons.org/samsung/ffffff",
    glow: "from-[#2760ff]/30 to-[#1c2450]/10"
  },
  {
    name: "Sony",
    href: "/categories/electronics",
    logo: "https://cdn.simpleicons.org/sony/ffffff",
    glow: "from-[#f4f7ff]/26 to-[#4d5668]/10"
  }
];

export function BrandShowcase() {
  return (
    <section className="mx-auto mt-8 max-w-6xl px-4 md:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-[linear-gradient(130deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_24px_36px_-28px_rgba(0,0,0,0.8)] backdrop-blur-md md:p-6">
        <div className="pointer-events-none absolute -left-20 -top-20 size-52 rounded-full bg-[#FB8500]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 size-56 rounded-full bg-[#8EB4C2]/18 blur-3xl" />

        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-base font-semibold uppercase tracking-[0.14em] text-[#dbe5f2]">
            Trusted Brands
          </h2>
          <p className="text-sm text-[#9fb0c2]">Powering style, tech and performance</p>
        </div>

        <div className="relative mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand, idx) => (
            <Link
              key={brand.name}
              href={brand.href}
              aria-label={`${brand.name} products`}
              className="group relative isolate"
            >
              <div className="rounded-xl border border-white/25 bg-[linear-gradient(140deg,rgba(255,255,255,0.16),rgba(255,255,255,0.05))] p-[1px] shadow-[0_16px_24px_-20px_rgba(0,0,0,0.85)] transition duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_22px_30px_-18px_rgba(251,133,0,0.8)]">
                <div className="relative grid h-20 place-items-center overflow-hidden rounded-[11px] bg-[#111827]/70">
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${brand.glow} opacity-90`} />
                  <div className="pointer-events-none absolute -right-3 -top-4 h-12 w-12 rounded-full border border-white/15 bg-white/5" />
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    width={118}
                    height={40}
                    unoptimized
                    className="relative z-10 h-9 w-auto object-contain opacity-100 drop-shadow-[0_5px_8px_rgba(0,0,0,0.55)] transition duration-300 group-hover:scale-105"
                  />
                  <span className={`pointer-events-none absolute bottom-1 ${idx % 2 ? "right-2" : "left-2"} h-1.5 w-1.5 rounded-full bg-white/70`} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
