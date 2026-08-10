"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { loginAdmin } from "@/admin/auth";
import { EVENT_INFO } from "@/landing/data/eventData";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const ok = loginAdmin(password.trim());
    if (!ok) {
      setError("Incorrect password. Please try again.");
      setLoading(false);
      return;
    }

    router.replace("/dashboard/");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-admin-bg">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 right-0 h-[520px] w-[520px] rounded-full bg-gold/[0.1] blur-[160px]" />
        <div className="absolute bottom-0 left-0 h-[380px] w-[380px] rounded-full bg-accent-blue/[0.08] blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-sm border border-admin-border bg-admin-surface p-8 shadow-sm md:p-10"
        >
          <div className="mb-8">
            <div className="relative mb-6 h-14 w-14 overflow-hidden rounded-full border border-gold/30 shadow-sm">
              <Image
                src="/images/jy-logo.png"
                alt="Jesus Youth"
                fill
                className="object-cover"
                sizes="56px"
                priority
              />
            </div>
            <p className="mb-3 text-xs font-heading uppercase tracking-[0.3em] text-gold-dim">
              Restricted Access
            </p>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-admin-ink md:text-4xl">
              Admin Panel
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-admin-muted">
              Sign in to view registration reports for {EVENT_INFO.name}{" "}
              {EVENT_INFO.year}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="admin-password"
                className="mb-2 block text-xs font-heading text-admin-muted"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-sm border border-admin-border bg-admin-elevated py-3 pl-4 pr-12 text-sm text-admin-ink placeholder:text-admin-muted/50 focus:border-gold/50 focus:outline-none"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-sm text-admin-muted transition-colors hover:text-admin-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error ? (
              <p className="text-xs text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center disabled:opacity-60"
            >
              {loading ? "Signing in…" : "Enter Dashboard"}
              <ArrowRight className="btn-arrow h-4 w-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
