"use client";

import { Suspense } from "react";
import { RegistrationDetailPage } from "@/admin/components/RegistrationDetailPage";

export default function RegistrationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-admin-bg">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        </div>
      }
    >
      <RegistrationDetailPage />
    </Suspense>
  );
}
