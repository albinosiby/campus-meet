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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#090a0f" },
    { media: "(prefers-color-scheme: dark)", color: "#090a0f" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "MCM '26 | Malabar Campus Meet | Jesus Youth",
  description:
    "A gathering of campus youth to encounter, connect, grow and live the mission together. September 18–21, 2026 at Don Bosco Arts & Science College, Angadikadavu.",
  keywords: [
    "Jesus Youth",
    "MCM",
    "MCM '26",
    "Malabar Campus Meet",
    "2026",
    "Campus Ministry",
    "Youth Conference",
    "Christian Youth",
    "Angadikadavu",
    "Don Bosco",
  ],
  icons: {
    icon: [{ url: "/images/jy-logo.png", type: "image/png" }],
    apple: [{ url: "/images/jy-logo.png" }],
  },
  openGraph: {
    title: "MCM '26 | Malabar Campus Meet | Jesus Youth",
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
    <html
      lang="en"
      className={`dark ${manrope.variable} ${inter.variable}`}
      style={{ colorScheme: "dark" }}
    >
      <body className="antialiased">
        <DevErrorFilter />
        {children}
      </body>
    </html>
  );
}
