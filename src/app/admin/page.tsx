"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAdminAuthenticated } from "@/admin/auth";
import { LoginForm } from "@/admin/components/LoginForm";

export default function AdminLoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAdminAuthenticated()) {
      router.replace("/admin/dashboard/");
    }
  }, [router]);

  return <LoginForm />;
}
