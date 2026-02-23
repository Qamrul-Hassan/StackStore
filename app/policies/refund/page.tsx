export default function RefundPolicyPage() {
  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-300">
        Home / <span className="font-semibold text-white">Refund Policy</span>
      </p>

      <section className="glass-panel section-shell section-single-cart cart-left rounded-2xl p-6 md:p-8">
        <div className="max-w-4xl space-y-4 text-[#334250]">
          <p className="section-tag">Policy</p>
          <h1 className="section-title">Refund & Return Policy</h1>
          <p className="text-sm text-[#748692]">Last updated: February 23, 2026</p>

          <PolicyBlock title="Return Window">
            Returns are accepted within 7 days from delivery date for eligible items.
          </PolicyBlock>
          <PolicyBlock title="Eligibility Conditions">
            Items must be unused, in original packaging, and include all accessories, tags, and invoice details.
          </PolicyBlock>
          <PolicyBlock title="Non-Returnable Items">
            Final-sale items, personal care products, and items damaged by misuse are not eligible for return
            unless received defective.
          </PolicyBlock>
          <PolicyBlock title="Refund Timeline">
            Once the return is approved and inspected, refunds are processed to the original payment method within
            5-10 business days.
          </PolicyBlock>
          <PolicyBlock title="How to Request">
            Submit a return request through the Contact page with order number, item details, and issue summary.
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

