import type { Metadata } from "next";
import { Outfit, Permanent_Marker } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import ThemeProviderWrapper from "@/components/providers/ThemeProviderWrapper";

// Only load the two fonts actually used on the page — Outfit for body/UI, Permanent Marker for the hero title.
// Dropped Bebas Neue, Roboto Slab, Space Grotesk (not distinctly used) to save ~3 network requests.
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});
const permanentMarker = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-permanent-marker",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Team Shogun — Operations Command Center",
  description: "Internal management platform for Team Shogun Fiverr agency. Track orders, revenue, deadlines, and team performance in real-time.",
  keywords: ["team shogun", "fiverr agency", "operations", "project management"],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Team Shogun Operations",
    description: "Fiverr agency command center",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${outfit.variable} ${permanentMarker.variable} font-sans bg-background text-foreground antialiased min-h-screen`} suppressHydrationWarning>
        <ThemeProviderWrapper><Providers>{children}</Providers></ThemeProviderWrapper>
      </body>
    </html>
  );
}
