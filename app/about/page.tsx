"use client";

import {
  BarChart3,
  Headset,
  Instagram,
  Linkedin,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Users
} from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";

export default function AboutPage() {
  const aboutStoryImage =
    "https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1600&auto=format&fit=crop";

  return (
    <div className="space-y-14 pb-8">
      <p className="text-sm text-zinc-300">
        Home / <span className="font-semibold text-white">About</span>
      </p>

      <section className="section-single-cart cart-left grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#FB8500]/50 bg-[#FB8500]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#FB8500]">
            About Exclusive
          </p>
          <h1 className="text-6xl font-bold text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.55)] md:text-7xl">
            Our Story
          </h1>
          <p className="max-w-xl text-zinc-200">
            Launched in 2015, Exclusive is South Asia&apos;s premier online shopping marketplace
            with an active presence in Bangladesh. Supported by wide range of tailored marketing,
            data and service solutions, Exclusive has 10,500 sellers and 300 brands.
          </p>
          <p className="max-w-xl text-zinc-200">
            Exclusive has more than 1 Million products to offer, growing at a very fast speed.
            Exclusive offers a diverse assortment in categories ranging from consumer.
          </p>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-white/20 bg-[linear-gradient(135deg,#28323F_0%,#210E14_100%)] shadow-[0_30px_44px_-24px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(251,133,0,0.22),transparent_34%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(142,180,194,0.18),transparent_34%)]" />
          <div className="relative h-full min-h-[420px] p-8">
            <img
              src={aboutStoryImage}
              alt="About Story"
              className="h-full w-full rounded-xl object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section className="section-single-cart cart-right grid gap-6 md:grid-cols-4">
        <MetricBox icon={<Users className="size-5" />} title={10.5} suffix="k" copy="Sellers active our site" />
        <MetricBox icon={<ShoppingBag className="size-5" />} title={33} suffix="k" copy="Monthly Product Sale" active />
        <MetricBox icon={<Users className="size-5" />} title={45.5} suffix="k" copy="Customer active in our site" />
        <MetricBox icon={<BarChart3 className="size-5" />} title={25} suffix="k" copy="Annual gross sale in our site" />
      </section>

      <section className="section-single-cart cart-left grid gap-6 md:grid-cols-3">
        <TeamCard
          name="Tom Cruise"
          role="Founder & Chairman"
          image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop"
        />
        <TeamCard
          name="Emma Watson"
          role="Managing Director"
          image="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=1200&auto=format&fit=crop"
        />
        <TeamCard
          name="Will Smith"
          role="Product Designer"
          image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"
        />
      </section>

      <section className="section-single-cart cart-right grid gap-8 border-t border-white/25 pt-12 text-center md:grid-cols-3">
        <SupportCard
          icon={<Truck className="size-5" />}
          title="FREE AND FAST DELIVERY"
          copy="Free delivery for all orders over $140"
        />
        <SupportCard
          icon={<Headset className="size-5" />}
          title="24/7 CUSTOMER SERVICE"
          copy="Friendly 24/7 customer support"
        />
        <SupportCard
          icon={<ShieldCheck className="size-5" />}
          title="MONEY BACK GUARANTEE"
          copy="We return money within 30 days"
        />
      </section>
    </div>
  );
}

function MetricBox({
  icon,
  title,
  suffix,
  copy,
  active
}: {
  icon: ReactNode;
  title: number;
  suffix: string;
  copy: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-6 text-center shadow-[0_22px_30px_-22px_rgba(0,0,0,0.6)] transition hover:-translate-y-1 hover:shadow-[0_26px_34px_-22px_rgba(0,0,0,0.75)] ${active ? "border-[#F92D0A] bg-[linear-gradient(105deg,#F92D0A_0%,#FB8500_100%)] text-white" : "border-white/45 bg-white/90 text-[#210E14]"}`}
    >
      <div className={`mx-auto mb-3 grid size-10 place-items-center rounded-full ${active ? "bg-white/20 text-white" : "bg-[#28323F]/10 text-[#210E14]"}`}>
        {icon}
      </div>
      <p className="text-5xl font-bold">
        <CountUpValue end={title} durationMs={2400} />
        {suffix}
      </p>
      <p className="mt-2 text-sm font-medium">{copy}</p>
    </div>
  );
}

function CountUpValue({ end, durationMs = 1800 }: { end: number; durationMs?: number }) {
  const [value, setValue] = useState(0);
  const decimals = useMemo(() => (Number.isInteger(end) ? 0 : 1), [end]);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = end * eased;
      setValue(next);
      if (t < 1) requestAnimationFrame(animate);
    };
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [end, durationMs]);

  return value.toFixed(decimals);
}

function TeamCard({ name, role, image }: { name: string; role: string; image: string }) {
  return (
    <div className="space-y-3">
      <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-white/20 bg-[linear-gradient(135deg,#334155_0%,#64748b_100%)] shadow-[0_24px_32px_-20px_rgba(0,0,0,0.65)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_32px_38px_-22px_rgba(0,0,0,0.8)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(255,255,255,0.14),transparent_28%)]" />
        <div className="relative h-full min-h-[320px] p-4">
          <img
            src={image}
            alt={name}
            className="h-full w-full rounded-xl object-cover"
            loading="lazy"
          />
        </div>
      </div>
      <h3 className="text-4xl font-bold text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]">{name}</h3>
      <p className="text-sm text-zinc-300">{role}</p>
      <div className="flex items-center gap-2">
        <SocialIcon icon={<Instagram className="size-4" />} />
        <SocialIcon icon={<Linkedin className="size-4" />} />
      </div>
    </div>
  );
}

function SupportCard({
  icon,
  title,
  copy
}: {
  icon: ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-xl border border-white/20 bg-[linear-gradient(170deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 space-y-2">
      <div className="mx-auto icon-circle">{icon}</div>
      <h4 className="text-lg font-semibold text-white">{title}</h4>
      <p className="text-sm text-zinc-300">{copy}</p>
    </div>
  );
}

function SocialIcon({ icon }: { icon: ReactNode }) {
  return (
    <button
      type="button"
      className="grid size-8 place-items-center rounded-full border border-white/35 bg-white/10 text-white transition hover:border-[#FB8500] hover:bg-[#FB8500]/20"
      aria-label="Social profile"
    >
      {icon}
    </button>
  );
}
