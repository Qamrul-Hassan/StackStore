import { Mail, PhoneCall } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ContactPage() {
  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-500">
        Home / <span className="text-[#210E14]">Contact</span>
      </p>

      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        <div className="rounded border border-[#e5e7eb] bg-white p-8">
          <div className="space-y-3 border-b border-[#e5e7eb] pb-8">
            <p className="flex items-center gap-3 text-2xl font-semibold text-[#210E14]">
              <span className="icon-circle bg-[#F92D0A]">
                <PhoneCall className="size-4" />
              </span>
              Call To Us
            </p>
            <p className="text-zinc-600">We are available 24/7, 7 days a week.</p>
            <p className="text-zinc-600">Phone: +8801611112222</p>
          </div>

          <div className="space-y-3 pt-8">
            <p className="flex items-center gap-3 text-2xl font-semibold text-[#210E14]">
              <span className="icon-circle bg-[#F92D0A]">
                <Mail className="size-4" />
              </span>
              Write To US
            </p>
            <p className="text-zinc-600">Fill out our form and we will contact you within 24 hours.</p>
            <p className="text-zinc-600">Emails: customer@exclusive.com</p>
            <p className="text-zinc-600">Emails: support@exclusive.com</p>
          </div>
        </div>

        <form className="rounded border border-[#e5e7eb] bg-white p-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Input className="h-12 bg-[#f5f5f5]" placeholder="Your Name *" />
            <Input className="h-12 bg-[#f5f5f5]" placeholder="Your Email *" />
            <Input className="h-12 bg-[#f5f5f5]" placeholder="Your Phone *" />
          </div>
          <textarea
            className="mt-4 min-h-[220px] w-full rounded border border-[#e5e7eb] bg-[#f5f5f5] p-3 outline-none focus:ring-2 focus:ring-[#F92D0A]"
            placeholder="Your Message"
          />
          <div className="mt-6 flex justify-end">
            <button className="rounded bg-[#F92D0A] px-10 py-3 text-sm font-semibold text-white transition hover:brightness-110">
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
