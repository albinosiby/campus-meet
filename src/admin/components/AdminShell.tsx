"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { isAdminAuthenticated, logoutAdmin } from "@/admin/auth";
import { EVENT_INFO } from "@/landing/data/eventData";

interface AdminShellProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AdminShell({ children, title, subtitle }: AdminShellProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      router.replace("/");
      return;
    }
    setReady(true);
  }, [router]);

  function handleLogout() {
    logoutAdmin();
    router.replace("/");
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-admin-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-admin-bg text-admin-ink">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-gold/[0.08] blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-accent-blue/[0.06] blur-[120px]" />
      </div>

      <header className="relative z-20 border-b border-admin-border bg-admin-surface/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-gold/25">
              <Image
                src="/images/jy-logo.png"
                alt="Jesus Youth"
                fill
                className="object-cover"
                sizes="40px"
                priority
              />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-heading uppercase tracking-[0.28em] text-gold-dim">
                Admin · {EVENT_INFO.abbreviation} {EVENT_INFO.shortYear}
              </p>
              <h1 className="truncate font-heading text-lg font-bold text-admin-ink md:text-xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="truncate text-xs text-admin-muted">{subtitle}</p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-sm border border-admin-border bg-admin-surface px-3 py-2 text-xs font-heading uppercase tracking-[0.16em] text-admin-muted transition-colors hover:border-gold/40 hover:text-admin-ink"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
        {children}
      </main>
    </div>
  );
}
