import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Compress all responses with Brotli/gzip
  compress: true,
  // Remove X-Powered-By header
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Auto-convert to AVIF first (50% smaller than WebP), fall back to WebP
    formats: ["image/avif", "image/webp"],
    // quality={100} is overkill — 85 is visually identical, significantly smaller
    qualities: [75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    // Tree-shake these large packages — only import what's actually used
    optimizePackageImports: ["lucide-react", "framer-motion", "gsap"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

