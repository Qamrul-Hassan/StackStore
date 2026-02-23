export default function TermsPage() {
  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-300">
        Home / <span className="font-semibold text-white">Terms of Use</span>
      </p>

      <section className="glass-panel section-shell section-single-cart cart-right rounded-2xl p-6 md:p-8">
        <div className="max-w-4xl space-y-4 text-[#334250]">
          <p className="section-tag">Legal</p>
          <h1 className="section-title">Terms of Use</h1>
          <p className="text-sm text-[#748692]">Last updated: February 23, 2026</p>

          <PolicyBlock title="Use of Service">
            By using this website, you agree to follow applicable laws and these terms. You are responsible for
            providing accurate account and checkout information.
          </PolicyBlock>
          <PolicyBlock title="Orders and Pricing">
            Product availability, pricing, and offers may change without notice. We reserve the right to cancel
            orders affected by errors, fraud risk, or stock limitations.
          </PolicyBlock>
          <PolicyBlock title="Account Responsibilities">
            Keep your account credentials confidential. You are responsible for actions performed through your
            account unless unauthorized access is proven.
          </PolicyBlock>
          <PolicyBlock title="Intellectual Property">
            Website content, branding, and assets are protected. Reuse, copy, or redistribution without
            permission is prohibited.
          </PolicyBlock>
          <PolicyBlock title="Limitation of Liability">
            We are not liable for indirect or consequential damages arising from website use, delivery delays, or
            third-party service interruptions.
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

