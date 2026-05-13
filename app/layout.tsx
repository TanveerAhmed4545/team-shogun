import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

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
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} font-sans bg-background text-foreground antialiased min-h-screen`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
