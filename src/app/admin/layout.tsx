import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Malabar Campus Meet 2026",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
