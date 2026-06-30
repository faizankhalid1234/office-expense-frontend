"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Shield, BarChart3, Wallet, Sparkles } from "lucide-react";
import { CompanyLogo } from "@/components/brand/company-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { COMPANY_NAME } from "@/lib/constants";
import { APP_LINKS } from "@/lib/app-urls";
import { useMounted } from "@/hooks/use-mounted";

interface AuthFormProps {
  mode: "login" | "register";
}

const features = [
  { icon: Wallet, text: "Track fuel & office expenses" },
  { icon: BarChart3, text: "Beautiful charts & reports" },
  { icon: Shield, text: "Secure admin panel" },
];

function AuthFormFallback() {
  return (
    <div className="flex min-h-screen min-h-[100dvh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export function AuthForm({ mode }: AuthFormProps) {
  return (
    <Suspense fallback={<AuthFormFallback />}>
      <AuthFormInner mode={mode} />
    </Suspense>
  );
}

function AuthFormInner({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useMounted();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (mode !== "login") return;
    const error = searchParams.get("error");
    if (!error) return;

    const message =
      error === "session_expired"
        ? "Session expired. Please sign in again."
        : error === "CredentialsSignin"
          ? "Invalid email or password"
          : "Sign in failed. Please try again.";
    toast.error(message);
  }, [mode, searchParams]);

  const adminLoginUrl = APP_LINKS.adminLogin();

  function getRedirectPath(): string {
    const callback = searchParams.get("callbackUrl");
    if (callback) {
      try {
        const url = new URL(callback, window.location.origin);
        if (url.origin === window.location.origin) {
          return `${url.pathname}${url.search}${url.hash}`;
        }
      } catch {
        // ignore malformed callbackUrl
      }
    }
    return "/dashboard";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20_000);

    try {
      if (mode === "register") {
        const res = await fetch("/api/website/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
          signal: controller.signal,
        });

        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          needsLogin?: boolean;
        };

        if (!res.ok) {
          throw new Error(data.error ?? "Registration failed");
        }

        if (data.needsLogin) {
          toast.success("Account created! Please sign in.");
          router.push("/auth/login");
          return;
        }

        toast.success("Account created! Welcome!");
        window.location.href = getRedirectPath();
        return;
      }

      const loginRes = await fetch("/api/website/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
        signal: controller.signal,
      });

      const loginData = (await loginRes.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!loginRes.ok) {
        toast.error(loginData.error ?? "Invalid email or password");
        return;
      }

      toast.success("Welcome back!");
      window.location.href = getRedirectPath();
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        toast.error("Request timed out. Check your connection and try again.");
      } else {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen min-h-[100dvh]">
      {/* Left — Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 mesh-bg opacity-20" />
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -right-10 bottom-20 h-60 w-60 rounded-full bg-primary/15 blur-3xl" />

        <div className="relative">
          <CompanyLogo size="xl" subtitle="Expense Manager" variant="light" />
        </div>

        <div className="relative space-y-8">
          <div>
            <p className="text-sm text-slate-300">
              Smart office expense management for your team
            </p>
          </div>

          <div className="space-y-4">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3 text-slate-200">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 border border-white/10">
                  <f.icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-500">
          © 2026 {COMPANY_NAME}. All rights reserved.
        </p>
      </div>

      {/* Right — Form */}
      <div
        className="mesh-bg flex flex-1 items-center justify-center px-4 py-8 sm:p-6 md:p-12"
        style={{
          paddingTop: "max(2rem, env(safe-area-inset-top))",
          paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
        }}
      >
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="mb-4 flex justify-center lg:hidden">
              <CompanyLogo size="md" subtitle="Expense Manager" />
            </div>
            <div className="mb-2 flex items-center gap-2 justify-center lg:justify-start">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {mode === "login" ? "Website login" : "Get started"}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              {mode === "login" ? "Sign in to the website" : "Create your account"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {mode === "login"
                ? "For employees — expenses, reports & dashboard"
                : "Set your name, email & password"}
            </p>
          </div>

          <div className="glass-card p-5 md:p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="h-10 rounded-xl border-border/60 bg-background/50 text-sm sm:h-10"
                    required
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className="h-10 rounded-xl border-border/60 bg-background/50 text-sm"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="h-10 rounded-xl border-border/60 bg-background/50 text-sm"
                  minLength={6}
                  required
                />
              </div>
              <Button
                type="submit"
                className="h-10 w-full rounded-xl text-xs font-semibold shadow-md shadow-primary/20"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading
                  ? mode === "login" ? "Signing in..." : "Creating account..."
                  : mode === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <p className="mt-5 text-center text-xs text-muted-foreground">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/register" className="font-semibold text-primary hover:underline">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link href="/auth/login" className="font-semibold text-primary hover:underline">
                    Sign in
                  </Link>
                </>
              )}
            </p>

            {mode === "login" && (
              <div className="mt-4 rounded-2xl bg-primary/10 p-3 text-[11px] text-primary">
                <p className="font-semibold mb-1">Demo accounts</p>
                <p>Admin: hafiz@gmail.com / 12345678</p>
                <p className="mt-1">Employee: hafiz@gmail.com / 12345678</p>
              </div>
            )}

            {mode === "login" && mounted && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Admin site (port 4000):{" "}
                <Link href={adminLoginUrl} className="font-semibold text-primary hover:underline">
                  {adminLoginUrl}
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
