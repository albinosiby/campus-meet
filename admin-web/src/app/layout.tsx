import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import { DevErrorFilter } from "@/shared/DevErrorFilter";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const viewport: Viewport = {
  themeColor: "#f3f4f7",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Admin | Malabar Campus Meet 2026",
  description: "Registration reports and payment verification for Malabar Campus Meet.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="antialiased">
        <DevErrorFilter />
        {children}
      </body>
    </html>
  );
}
