import { Star } from "lucide-react";

const reviews = [
  {
    name: "A. Rahman",
    location: "Dhaka, BD",
    rating: 5,
    title: "Fast delivery and genuine products",
    message:
      "The product quality matched the description exactly. Packaging was secure and delivery arrived earlier than expected."
  },
  {
    name: "M. Hasan",
    location: "Chattogram, BD",
    rating: 5,
    title: "Smooth checkout experience",
    message:
      "Checkout was simple, payment worked on first try, and order status updates were clear from confirmation to delivery."
  },
  {
    name: "S. Ahmed",
    location: "Sylhet, BD",
    rating: 4,
    title: "Good support response",
    message:
      "I had a question about size and support replied quickly with clear guidance. Overall, very reliable shopping experience."
  },
  {
    name: "N. Khan",
    location: "Khulna, BD",
    rating: 5,
    title: "Excellent value for money",
    message:
      "Discounts are real and product quality is strong. This has become my regular store for electronics and essentials."
  }
];

function Rating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Rating ${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={`size-4 ${index < value ? "fill-[#FB8500] text-[#FB8500]" : "text-[#c8d0da]"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const averageRating = (
    reviews.reduce((sum, item) => sum + item.rating, 0) / Math.max(1, reviews.length)
  ).toFixed(1);

  return (
    <div className="space-y-10 pb-8">
      <p className="text-sm text-zinc-300">
        Home / <span className="font-semibold text-white">Reviews</span>
      </p>

      <section className="glass-panel section-shell section-single-cart cart-right rounded-2xl p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
          <div className="space-y-3">
            <p className="section-tag">Trust</p>
            <h1 className="section-title">Customer Reviews</h1>
            <p className="text-sm text-[#50606d]">
              Real feedback from customers who purchased and used products from StackStore.
            </p>
          </div>
          <div className="rounded-xl border border-[#dbe2ea] bg-white/90 px-5 py-4 text-[#210E14]">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#712825]">Average Rating</p>
            <p className="mt-1 text-3xl font-bold">{averageRating}/5</p>
            <Rating value={Math.round(Number(averageRating))} />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((item) => (
            <article
              key={`${item.name}-${item.title}`}
              className="rounded-xl border border-[#dbe2ea] bg-white/90 p-5 shadow-[0_18px_28px_-24px_rgba(33,14,20,0.7)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-[#210E14]">{item.name}</p>
                  <p className="text-xs text-[#7a8a98]">{item.location}</p>
                </div>
                <Rating value={item.rating} />
              </div>
              <h2 className="mt-3 text-base font-semibold text-[#210E14]">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#556574]">{item.message}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

