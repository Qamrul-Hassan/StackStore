export default function PrivacyPolicyPage() {
  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-300">
        Home / <span className="font-semibold text-white">Privacy Policy</span>
      </p>

      <section className="glass-panel section-shell section-single-cart cart-left rounded-2xl p-6 md:p-8">
        <div className="max-w-4xl space-y-4 text-[#334250]">
          <p className="section-tag">Legal</p>
          <h1 className="section-title">Privacy Policy</h1>
          <p className="text-sm text-[#748692]">Last updated: February 23, 2026</p>

          <PolicyBlock title="Information We Collect">
            We collect account details, contact information, shipping address, and order history to provide and
            improve our services.
          </PolicyBlock>
          <PolicyBlock title="How We Use Information">
            We use your information to process orders, provide support, detect fraud, and send transactional
            updates such as order confirmations and delivery notifications.
          </PolicyBlock>
          <PolicyBlock title="Data Sharing">
            We only share necessary data with trusted service providers such as payment processors, shipping
            partners, and technical infrastructure providers.
          </PolicyBlock>
          <PolicyBlock title="Data Security">
            We apply technical and organizational safeguards to protect your data from unauthorized access,
            misuse, or disclosure.
          </PolicyBlock>
          <PolicyBlock title="Your Rights">
            You may request access, correction, or deletion of your personal data by contacting support through
            the Contact page.
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

