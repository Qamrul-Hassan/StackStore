import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center py-16">
      <div className="space-y-6 text-center">
        <p className="text-sm text-zinc-500">Home / 404 Error</p>
        <h1 className="text-8xl font-semibold text-[#210E14] md:text-9xl">404 Not Found</h1>
        <p className="text-zinc-500">Your visited page not found. You may go home page.</p>
        <Link
          href="/"
          className="inline-flex rounded bg-[#F92D0A] px-8 py-3 text-sm font-semibold text-white transition hover:brightness-110"
        >
          Back to home page
        </Link>
      </div>
    </div>
  );
}
