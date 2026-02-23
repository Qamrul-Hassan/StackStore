export default function CookiePolicyPage() {
  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-300">
        Home / <span className="font-semibold text-white">Cookie Policy</span>
      </p>

      <section className="glass-panel section-shell section-single-cart cart-left rounded-2xl p-6 md:p-8">
        <div className="max-w-4xl space-y-4 text-[#334250]">
          <p className="section-tag">Policy</p>
          <h1 className="section-title">Cookie Policy</h1>
          <p className="text-sm text-[#748692]">Last updated: February 23, 2026</p>

          <PolicyBlock title="What Are Cookies">
            Cookies are small text files stored on your device to help websites remember preferences and improve
            functionality.
          </PolicyBlock>
          <PolicyBlock title="How We Use Cookies">
            We use cookies for essential site features, session management, performance analytics, and improved
            user experience.
          </PolicyBlock>
          <PolicyBlock title="Managing Cookies">
            You can control or disable cookies through browser settings. Some features may not work properly if
            essential cookies are blocked.
          </PolicyBlock>
          <PolicyBlock title="Third-Party Cookies">
            Some trusted service providers may set cookies for analytics, security, or embedded content.
          </PolicyBlock>
          <PolicyBlock title="Policy Updates">
            We may update this policy periodically. Any changes will be posted on this page with the latest update
            date.
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

