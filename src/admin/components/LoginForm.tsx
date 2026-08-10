"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LockKeyhole, ArrowRight } from "lucide-react";
import { loginAdmin } from "@/admin/auth";
import { EVENT_INFO } from "@/landing/data/eventData";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
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

    router.replace("/admin/dashboard/");
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
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-sm border border-gold/30 bg-gold/10">
              <LockKeyhole className="h-5 w-5 text-gold-dim" />
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
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-sm border border-admin-border bg-admin-elevated px-4 py-3 text-sm text-admin-ink placeholder:text-admin-muted/50 focus:border-gold/50 focus:outline-none"
                placeholder="Enter admin password"
              />
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
