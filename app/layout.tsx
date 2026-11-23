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
  title: {
    default: "Team Shogun | Premium Digital Solutions",
    template: "%s | Team Shogun",
  },
  description: "Six specialisations. One agency. Built to an ultra-premium visual and technical standard — Shopify, Squarespace, React, 3D WebGL & Full-Stack Development.",
  keywords: ["Team Shogun", "Shopify agency", "React development", "Three.js WebGL", "Squarespace expert", "Fiverr top rated agency"],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Team Shogun | Premium Digital Solutions",
    description: "Six specialisations. One agency. Built to an ultra-premium visual and technical standard.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Team Shogun | Premium Digital Solutions",
    description: "Six specialisations. One agency. Built to an ultra-premium visual and technical standard.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  // Intercept and strip browser extension injected attributes (e.g. Bitdefender bis_skin_checked)
                  var clean = function(el) {
                    if (el && el.removeAttribute) {
                      el.removeAttribute('bis_skin_checked');
                      el.removeAttribute('bis_register');
                    }
                  };
                  var obs = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes' && m.attributeName && m.attributeName.indexOf('bis_') === 0) {
                        clean(m.target);
                      }
                    }
                  });
                  obs.observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    attributeFilter: ['bis_skin_checked', 'bis_register']
                  });

                  // Suppress dev overlay popup for extension-injected hydration false positives
                  if (typeof window !== 'undefined') {
                    var origError = console.error;
                    console.error = function() {
                      var str = Array.prototype.slice.call(arguments).join(' ');
                      if (str.indexOf('bis_skin_checked') !== -1) return;
                      origError.apply(console, arguments);
                    };
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${outfit.variable} ${permanentMarker.variable} font-sans bg-background text-foreground antialiased min-h-screen`} suppressHydrationWarning>
        <ThemeProviderWrapper><Providers>{children}</Providers></ThemeProviderWrapper>
      </body>
    </html>
  );
}
