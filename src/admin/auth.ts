const ADMIN_SESSION_KEY = "malabar-campus-meet-admin-session";

function getAdminPassword(): string {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "malabar-admin-2026";
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "authenticated";
}

export function loginAdmin(password: string): boolean {
  if (password !== getAdminPassword()) return false;
  sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
  return true;
}

export function logoutAdmin(): void {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}
