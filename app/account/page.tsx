"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function passwordChecks(password: string) {
  return {
    minLength: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password)
  };
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(value);
}

type UserOrder = {
  id: string;
  status: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    unitPrice: number;
    product: {
      id: string;
      slug: string;
      name: string;
      imageUrl: string;
    };
  }[];
};

async function readSafeJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function AccountPageContent() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signup");

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInEmailTouched, setSignInEmailTouched] = useState(false);

  const [name, setName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpEmailTouched, setSignUpEmailTouched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  const checks = useMemo(() => passwordChecks(signUpPassword), [signUpPassword]);
  const isStrongPassword = Object.values(checks).every(Boolean);
  const passwordMatch = signUpPassword.length > 0 && signUpPassword === confirmPassword;
  const signInEmailInvalid = signInEmailTouched && signInEmail.trim().length > 0 && !isValidEmail(signInEmail.trim());
  const signUpEmailInvalid = signUpEmailTouched && signUpEmail.trim().length > 0 && !isValidEmail(signUpEmail.trim());
  const verifiedState = searchParams.get("verified");

  useEffect(() => {
    if (status !== "authenticated") {
      setOrders([]);
      setOrdersError("");
      setOrdersLoading(false);
      return;
    }

    let cancelled = false;
    setOrdersLoading(true);
    setOrdersError("");

    void (async () => {
      try {
        const res = await fetch("/api/user/orders", { cache: "no-store" });
        const payload = await readSafeJson<{ error?: string; orders?: UserOrder[] }>(res);
        if (!res.ok) {
          if (!cancelled) setOrdersError(payload?.error ?? "Failed to load order history.");
          return;
        }
        if (!cancelled) setOrders(Array.isArray(payload?.orders) ? payload.orders : []);
      } catch {
        if (!cancelled) setOrdersError("Failed to load order history.");
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [status]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [resendCooldown]);

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setMode("signin");
    setLoading(true);
    setError("");
    setMessage("");
    setSignInEmailTouched(true);

    const normalizedEmail = signInEmail.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setLoading(false);
      setError("Enter a valid email address (example: name@example.com).");
      return;
    }

    const result = await signIn("credentials", {
      email: normalizedEmail,
      password: signInPassword,
      redirect: false
    });

    setLoading(false);
    if (!result || result.error) {
      setError("Invalid credentials or email not verified.");
      return;
    }
    setMessage("Signed in successfully.");
  }

  async function onSignUp(e: React.FormEvent) {
    e.preventDefault();
    setMode("signup");
    setLoading(true);
    setError("");
    setMessage("");
    setSignUpEmailTouched(true);

    const normalizedEmail = signUpEmail.trim().toLowerCase();
    if (!isValidEmail(normalizedEmail)) {
      setLoading(false);
      setError("Enter a valid email address (example: name@example.com).");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: normalizedEmail,
          password: signUpPassword,
          confirmPassword
        })
      });
      const payload = await readSafeJson<{ error?: string; warning?: string; verifyUrl?: string }>(res);
      if (!res.ok) {
        setError(payload?.error ?? "Signup failed.");
        return;
      }

      if (payload?.warning) {
        setMessage(`${payload.warning} Verification link: ${payload.verifyUrl}`);
      } else {
        setMessage("Account created. Verification email sent. Please verify, then sign in.");
      }
      setVerificationEmail(normalizedEmail);
      setSignInEmail(normalizedEmail);
      setResendCooldown(60);
      setMode("signin");
    } catch {
      setError("Network/server error during signup. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function onResendVerification() {
    setResending(true);
    setError("");
    setMessage("");

    const email = verificationEmail.trim().toLowerCase();
    if (!email) {
      setResending(false);
      setError("Sign up first to use resend verification.");
      return;
    }
    if (!isValidEmail(email)) {
      setResending(false);
      setError("Enter a valid email address before resending verification.");
      return;
    }

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const payload = await readSafeJson<{ error?: string; warning?: string; verifyUrl?: string; message?: string }>(res);
      if (!res.ok) {
        setError(payload?.error ?? "Failed to resend verification.");
        return;
      }

      if (payload?.warning) {
        setMessage(`${payload.message ?? "Verification link generated."} ${payload.warning} ${payload.verifyUrl ?? ""}`.trim());
      } else {
        setMessage(payload?.message ?? "Verification email sent.");
      }
      setResendCooldown(60);
    } catch {
      setError("Network/server error while resending verification.");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className="space-y-10 pb-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-300">
          Home / <span className="font-semibold text-white">My Account</span>
        </p>
        {status === "authenticated" ? (
          <p className="text-sm text-zinc-200">
            Welcome! <span className="font-semibold text-[#FB8500]">{session.user?.name ?? session.user?.email}</span>
          </p>
        ) : null}
      </div>

      {verifiedState === "1" ? (
        <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Email verified successfully. You can sign in now.
        </p>
      ) : null}
      {verifiedState === "0" ? (
        <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          Verification link is invalid.
        </p>
      ) : null}
      {verifiedState === "expired" ? (
        <p className="rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Verification link expired. Please sign up again to receive a new one.
        </p>
      ) : null}

      {status === "authenticated" ? (
        <div className="glass-panel section-shell section-single-cart cart-right rounded-2xl p-8">
          <h1 className="text-4xl font-semibold text-[#F92D0A]">Account</h1>
          <div className="mt-6 grid gap-4 text-[#210E14]">
            <p><span className="font-semibold">Name:</span> {session.user?.name ?? "-"}</p>
            <p><span className="font-semibold">Email:</span> {session.user?.email ?? "-"}</p>
            <p><span className="font-semibold">Role:</span> {session.user?.role ?? "CUSTOMER"}</p>
          </div>
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-[#210E14]">My Orders</h2>
            {ordersLoading ? (
              <p className="text-sm text-zinc-600">Loading order history...</p>
            ) : null}
            {ordersError ? (
              <p className="text-sm text-red-600">{ordersError}</p>
            ) : null}
            {!ordersLoading && !ordersError && orders.length === 0 ? (
              <p className="text-sm text-zinc-700">No orders yet. Place your first order from checkout.</p>
            ) : null}
            {!ordersLoading && !ordersError && orders.length > 0 ? (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-white/50 bg-white/70 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <p className="font-mono text-xs text-zinc-700">Order: {order.id}</p>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-zinc-700 md:grid-cols-3">
                      <p>
                        <span className="font-semibold text-[#210E14]">Placed:</span>{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <span className="font-semibold text-[#210E14]">Payment:</span> {order.paymentMethod}
                      </p>
                      <p>
                        <span className="font-semibold text-[#210E14]">Total:</span> ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-3 border-t border-zinc-200 pt-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">Items</p>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <p key={item.id} className="text-sm text-zinc-800">
                            <Link href={`/products/${item.product.slug}`} className="font-medium underline-offset-2 hover:underline">
                              {item.product.name}
                            </Link>{" "}
                            x{item.quantity} <span className="text-zinc-600">(${item.unitPrice.toFixed(2)} each)</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
          <div className="mt-6">
            <Button
              onClick={() => signOut({ callbackUrl: "/account" })}
              className="bg-gradient-to-r from-[#210E14] via-[#712825] to-[#F92D0A] text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="glass-panel section-shell section-single-cart cart-left rounded-2xl p-8">
            <h2 className="text-3xl font-semibold text-[#210E14]">Sign In</h2>
            <form className="mt-6 space-y-4" onSubmit={onSignIn} autoComplete="off">
              <Input
                type="email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                onBlur={() => setSignInEmailTouched(true)}
                placeholder="name@example.com"
                autoComplete="off"
                inputMode="email"
                spellCheck={false}
                className="h-12 border-[#cfd8e3] bg-white/95 text-[#111827] placeholder:text-[#6b7280]"
                required
              />
              {signInEmailInvalid ? <p className="-mt-2 text-xs text-red-600">Use a valid email format.</p> : null}
              <PasswordField
                show={showSignInPassword}
                onToggle={() => setShowSignInPassword((prev) => !prev)}
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="h-12 border-[#cfd8e3] bg-white/95 text-[#111827] placeholder:text-[#6b7280]"
                required
              />
              <Button disabled={loading} className="w-full bg-gradient-to-r from-[#210E14] via-[#712825] to-[#F92D0A] text-white">
                {loading && mode === "signin" ? "Signing in..." : "Sign In"}
              </Button>
              {verificationEmail ? (
                <div className="rounded-lg border border-[#d5dde7] bg-white/70 px-3 py-3">
                  <p className="mb-2 text-xs text-[#4b5563]">
                    Didn&apos;t receive verification email at <span className="font-semibold">{verificationEmail}</span>?
                  </p>
                  <button
                    type="button"
                    onClick={onResendVerification}
                    disabled={resending || resendCooldown > 0}
                    className="w-full rounded-md border border-[#d5dde7] bg-white/80 px-3 py-2 text-sm font-medium text-[#210E14] transition hover:border-[#FB8500] hover:bg-[#FB8500]/15 disabled:opacity-60"
                  >
                    {resending ? "Sending..." : resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : "Resend Verification Email"}
                  </button>
                </div>
              ) : null}
            </form>
          </div>

          <div className="glass-panel section-shell section-single-cart cart-right rounded-2xl p-8">
            <h2 className="text-3xl font-semibold text-[#210E14]">Sign Up</h2>
            <form className="mt-6 space-y-4" onSubmit={onSignUp} autoComplete="off">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                autoComplete="name"
                className="h-12 border-[#cfd8e3] bg-white/95 text-[#111827] placeholder:text-[#6b7280]"
                required
              />
              <Input
                type="email"
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                onBlur={() => setSignUpEmailTouched(true)}
                placeholder="name@example.com"
                autoComplete="off"
                inputMode="email"
                spellCheck={false}
                className="h-12 border-[#cfd8e3] bg-white/95 text-[#111827] placeholder:text-[#6b7280]"
                required
              />
              {signUpEmailInvalid ? <p className="-mt-2 text-xs text-red-600">Use a valid email format.</p> : null}
              <PasswordField
                show={showSignUpPassword}
                onToggle={() => setShowSignUpPassword((prev) => !prev)}
                value={signUpPassword}
                onChange={(e) => setSignUpPassword(e.target.value)}
                placeholder="Password (min 8)"
                autoComplete="new-password"
                className="h-12 border-[#cfd8e3] bg-white/95 text-[#111827] placeholder:text-[#6b7280]"
                required
                minLength={8}
              />
              <PasswordField
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((prev) => !prev)}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                autoComplete="new-password"
                className="h-12 border-[#cfd8e3] bg-white/95 text-[#111827] placeholder:text-[#6b7280]"
                required
                minLength={8}
              />

              <div className="rounded-lg border border-[#d5dde7] bg-white/65 px-3 py-2 text-xs text-[#210E14]">
                <p className="mb-1 font-semibold">Password requirements:</p>
                <ul className="space-y-1">
                  <li className={checks.minLength ? "text-emerald-700" : "text-zinc-600"}>At least 8 characters</li>
                  <li className={checks.upper ? "text-emerald-700" : "text-zinc-600"}>At least 1 uppercase letter</li>
                  <li className={checks.lower ? "text-emerald-700" : "text-zinc-600"}>At least 1 lowercase letter</li>
                  <li className={checks.number ? "text-emerald-700" : "text-zinc-600"}>At least 1 number</li>
                  <li className={checks.symbol ? "text-emerald-700" : "text-zinc-600"}>At least 1 special character</li>
                  <li className={passwordMatch ? "text-emerald-700" : "text-zinc-600"}>Password and confirm password must match</li>
                </ul>
              </div>

              <Button disabled={loading || !isStrongPassword || !passwordMatch || signUpEmailInvalid} className="w-full bg-gradient-to-r from-[#210E14] via-[#712825] to-[#F92D0A] text-white disabled:opacity-55">
                {loading && mode === "signup" ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border border-[#d5dde7] bg-white/65 px-4 py-3 text-sm text-[#210E14]">
              Already have an account?{" "}
              <button type="button" className="font-semibold underline" onClick={() => setMode("signin")}>
                Use Sign In
              </button>{" "}
              | Need a new account?{" "}
              <button type="button" className="font-semibold underline" onClick={() => setMode("signup")}>
                Use Sign Up
              </button>
            </div>
          </div>

          {error ? <p className="lg:col-span-2 text-sm text-red-500">{error}</p> : null}
          {message ? <p className="lg:col-span-2 text-sm text-emerald-200">{message}</p> : null}
        </div>
      )}
    </div>
  );
}

function statusClass(status: string) {
  if (status === "FAILED" || status === "CANCELLED") {
    return "bg-red-100 text-red-700";
  }
  if (status === "DELIVERED" || status === "PAID") {
    return "bg-emerald-100 text-emerald-700";
  }
  if (status === "PROCESSING" || status === "SHIPPED") {
    return "bg-blue-100 text-blue-700";
  }
  return "bg-amber-100 text-amber-700";
}

function PasswordField({
  value,
  onChange,
  placeholder,
  autoComplete,
  className,
  required,
  minLength,
  show,
  onToggle
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  autoComplete?: string;
  className?: string;
  required?: boolean;
  minLength?: number;
  show: boolean;
  onToggle: () => void;
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const showToggle = hasValue || isFocused;

  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${className ?? ""} ${showToggle ? "pr-12" : ""}`}
        required={required}
        minLength={minLength}
      />
      {showToggle ? (
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={onToggle}
          className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-[#d6deea] bg-[linear-gradient(145deg,#ffffff,#eef3f9)] text-[#3f4b5d] shadow-[0_8px_16px_-10px_rgba(24,32,44,0.55)] transition hover:scale-105 hover:border-[#FB8500]/70 hover:text-[#F92D0A]"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      ) : null}
    </div>
  );
}


function AccountPageFallback() {
  return (
    <div className="space-y-6 pb-8">
      <p className="text-sm text-zinc-300">
        Home / <span className="font-semibold text-white">My Account</span>
      </p>
      <div className="glass-panel section-shell section-single-cart cart-right rounded-2xl p-8 text-zinc-500">
        Loading account...
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountPageFallback />}>
      <AccountPageContent />
    </Suspense>
  );
}
