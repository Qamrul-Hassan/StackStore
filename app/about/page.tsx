import { Truck, Headset, ShieldCheck } from "lucide-react";
import { ReactNode } from "react";

export default function AboutPage() {
  return (
    <div className="space-y-14 pb-8">
      <p className="text-sm text-zinc-500">
        Home / <span className="text-[#210E14]">About</span>
      </p>

      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <h1 className="text-6xl font-semibold text-[#210E14]">Our Story</h1>
          <p className="text-zinc-600">
            Launched in 2015, Exclusive is South Asia&apos;s premier online shopping marketplace
            with an active presence in Bangladesh. Supported by wide range of tailored marketing,
            data and service solutions, Exclusive has 10,500 sellers and 300 brands.
          </p>
          <p className="text-zinc-600">
            Exclusive has more than 1 Million products to offer, growing at a very fast speed.
            Exclusive offers a diverse assortment in categories ranging from consumer.
          </p>
        </div>
        <div className="relative min-h-[420px] overflow-hidden rounded bg-[#f5f5f5]">
          <img
            src="/assets/sections/about-story.svg"
            alt="About"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-4">
        <MetricBox title="10.5k" copy="Sellers active our site" />
        <MetricBox title="33k" copy="Monthly Product Sale" active />
        <MetricBox title="45.5k" copy="Customer active in our site" />
        <MetricBox title="25k" copy="Annual gross sale in our site" />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <TeamCard
          name="Tom Cruise"
          role="Founder & Chairman"
          image="/assets/sections/team-tom.svg"
        />
        <TeamCard
          name="Emma Watson"
          role="Managing Director"
          image="/assets/sections/team-emma.svg"
        />
        <TeamCard
          name="Will Smith"
          role="Product Designer"
          image="/assets/sections/team-will.svg"
        />
      </section>

      <section className="grid gap-8 border-t border-[#e5e7eb] pt-12 text-center md:grid-cols-3">
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

function MetricBox({ title, copy, active }: { title: string; copy: string; active?: boolean }) {
  return (
    <div
      className={`rounded border p-6 text-center ${active ? "border-[#F92D0A] bg-[#F92D0A] text-white" : "border-[#e5e7eb] bg-white text-[#210E14]"}`}
    >
      <p className="text-5xl font-semibold">{title}</p>
      <p className="mt-2 text-sm">{copy}</p>
    </div>
  );
}

function TeamCard({ name, role, image }: { name: string; role: string; image: string }) {
  return (
    <div className="space-y-3">
      <div className="relative min-h-[320px] overflow-hidden rounded bg-[#f5f5f5]">
        <img
          src={image}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <h3 className="text-4xl font-semibold text-[#210E14]">{name}</h3>
      <p className="text-sm text-zinc-500">{role}</p>
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
    <div className="space-y-2">
      <div className="mx-auto icon-circle">{icon}</div>
      <h4 className="text-lg font-semibold text-[#210E14]">{title}</h4>
      <p className="text-sm text-zinc-500">{copy}</p>
    </div>
  );
}
