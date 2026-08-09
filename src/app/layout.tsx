import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
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
  themeColor: "#090a0f",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Malabar Campus Meet 2026 | Jesus Youth",
  description:
    "A gathering of campus youth to encounter, connect, grow and live the mission together. September 18–21, 2026 at Don Bosco Arts & Science College, Angadikadavu.",
  keywords: [
    "Jesus Youth",
    "Malabar Campus Meet",
    "2026",
    "Campus Ministry",
    "Youth Conference",
    "Christian Youth",
    "Angadikadavu",
    "Don Bosco",
  ],
  openGraph: {
    title: "Malabar Campus Meet 2026 | Jesus Youth",
    description:
      "Gather. Grow. Go. — A gathering of campus youth across Malabar. September 18–21, 2026.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
