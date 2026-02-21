"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
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

  const [name, setName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const checks = useMemo(() => passwordChecks(signUpPassword), [signUpPassword]);
  const isStrongPassword = Object.values(checks).every(Boolean);
  const passwordMatch = signUpPassword.length > 0 && signUpPassword === confirmPassword;
  const verifiedState = searchParams.get("verified");

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setMode("signin");
    setLoading(true);
    setError("");
    setMessage("");

    const result = await signIn("credentials", {
      email: signInEmail,
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

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: signUpEmail,
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

    const email = (signInEmail || signUpEmail).trim().toLowerCase();
    if (!email) {
      setResending(false);
      setError("Enter your email first, then click Resend Verification.");
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
            <form className="mt-6 space-y-4" onSubmit={onSignIn}>
              <Input type="email" value={signInEmail} onChange={(e) => setSignInEmail(e.target.value)} placeholder="Email" required />
              <Input type="password" value={signInPassword} onChange={(e) => setSignInPassword(e.target.value)} placeholder="Password" required />
              <Button disabled={loading} className="w-full bg-gradient-to-r from-[#210E14] via-[#712825] to-[#F92D0A] text-white">
                {loading && mode === "signin" ? "Signing in..." : "Sign In"}
              </Button>
              <button
                type="button"
                onClick={onResendVerification}
                disabled={resending}
                className="w-full rounded-md border border-white/40 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:border-[#FB8500] hover:bg-[#FB8500]/15 disabled:opacity-60"
              >
                {resending ? "Sending..." : "Resend Verification Email"}
              </button>
            </form>
          </div>

          <div className="glass-panel section-shell section-single-cart cart-right rounded-2xl p-8">
            <h2 className="text-3xl font-semibold text-[#210E14]">Sign Up</h2>
            <form className="mt-6 space-y-4" onSubmit={onSignUp}>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full Name" required />
              <Input type="email" value={signUpEmail} onChange={(e) => setSignUpEmail(e.target.value)} placeholder="Email" required />
              <Input type="password" value={signUpPassword} onChange={(e) => setSignUpPassword(e.target.value)} placeholder="Password (min 8)" required minLength={8} />
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" required minLength={8} />

              <div className="rounded-lg border border-white/35 bg-white/10 px-3 py-2 text-xs text-white">
                <p className="mb-1 font-semibold">Password suggestions:</p>
                <ul className="space-y-1">
                  <li className={checks.minLength ? "text-emerald-300" : "text-zinc-200"}>At least 8 characters</li>
                  <li className={checks.upper ? "text-emerald-300" : "text-zinc-200"}>At least 1 uppercase letter</li>
                  <li className={checks.lower ? "text-emerald-300" : "text-zinc-200"}>At least 1 lowercase letter</li>
                  <li className={checks.number ? "text-emerald-300" : "text-zinc-200"}>At least 1 number</li>
                  <li className={checks.symbol ? "text-emerald-300" : "text-zinc-200"}>At least 1 special character</li>
                  <li className={passwordMatch ? "text-emerald-300" : "text-zinc-200"}>Password and confirm password match</li>
                </ul>
              </div>

              <Button disabled={loading || !isStrongPassword || !passwordMatch} className="w-full bg-gradient-to-r from-[#210E14] via-[#712825] to-[#F92D0A] text-white disabled:opacity-55">
                {loading && mode === "signup" ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-xl border border-white/40 bg-white/10 px-4 py-3 text-sm text-white">
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
          {message ? <p className="lg:col-span-2 text-sm text-emerald-400">{message}</p> : null}
        </div>
      )}
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
