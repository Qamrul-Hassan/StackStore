export default function ShippingPolicyPage() {
  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-300">
        Home / <span className="font-semibold text-white">Shipping Policy</span>
      </p>

      <section className="glass-panel section-shell section-single-cart cart-right rounded-2xl p-6 md:p-8">
        <div className="max-w-4xl space-y-4 text-[#334250]">
          <p className="section-tag">Policy</p>
          <h1 className="section-title">Shipping & Delivery Policy</h1>
          <p className="text-sm text-[#748692]">Last updated: February 23, 2026</p>

          <PolicyBlock title="Processing Time">
            Orders are typically processed within 1-2 business days after payment confirmation.
          </PolicyBlock>
          <PolicyBlock title="Delivery Time">
            Standard delivery usually takes 3-7 business days depending on destination and courier performance.
          </PolicyBlock>
          <PolicyBlock title="Shipping Charges">
            Shipping charges are calculated at checkout based on item weight, destination, and chosen delivery
            service.
          </PolicyBlock>
          <PolicyBlock title="Order Tracking">
            Tracking information is shared by email once the order is dispatched from our warehouse.
          </PolicyBlock>
          <PolicyBlock title="Delays">
            External events such as weather, customs, or courier disruptions may affect delivery times.
          </PolicyBlock>
        </div>
      </section>
    </div>
  );
}

function PolicyBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="rounded-xl border border-[#dbe2ea] bg-white/90 p-5">
      <h2 className="text-base font-semibold text-[#210E14]">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed">{children}</p>
    </article>
  );
}

