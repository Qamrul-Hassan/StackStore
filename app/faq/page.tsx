const faqs = [
  {
    q: "How long does delivery take?",
    a: "Standard delivery usually takes 3-7 business days. During peak seasons, delivery can take up to 10 business days."
  },
  {
    q: "Can I return a product if I change my mind?",
    a: "Yes. You can request a return within 7 days of delivery if the item is unused, in original condition, and includes original packaging."
  },
  {
    q: "How do I track my order?",
    a: "After dispatch, we send your tracking details by email. You can also contact support with your order number for a real-time update."
  },
  {
    q: "What payment methods do you accept?",
    a: "We support major cards and approved local payment options. Available methods are shown at checkout based on your location."
  },
  {
    q: "What if I receive a damaged or wrong item?",
    a: "Contact us within 48 hours of delivery with photos and your order number. We prioritize replacement or refund based on stock and policy."
  },
  {
    q: "How can I contact support?",
    a: "Use the Contact page form or email support directly. Our target response time is within 24 business hours."
  }
];

export default function FaqPage() {
  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-300">
        Home / <span className="font-semibold text-white">FAQ</span>
      </p>

      <section className="glass-panel section-shell section-single-cart cart-left rounded-2xl p-6 md:p-8">
        <div className="max-w-3xl space-y-3">
          <p className="section-tag">Support</p>
          <h1 className="section-title">Frequently Asked Questions</h1>
          <p className="text-sm text-[#50606d]">
            Quick answers to the most common questions about orders, shipping, refunds, and support.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          {faqs.map((item) => (
            <article
              key={item.q}
              className="rounded-xl border border-[#dbe2ea] bg-white/90 p-5 shadow-[0_18px_28px_-24px_rgba(33,14,20,0.7)]"
            >
              <h2 className="text-base font-semibold text-[#210E14]">{item.q}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#556574]">{item.a}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

