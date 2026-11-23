"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote:
      "Team Shogun completely transformed our custom Shopify storefront. The speed, liquid code architecture, and 3D product previews helped us achieve a 34% increase in conversions in our first month.",
    author: "Alexander Wright",
    role: "Founder & CEO, Apex Supply",
    rating: 5,
    platform: "Shopify Plus",
    avatar: "AW",
    accent: "from-emerald-500/20 to-cyan-500/10",
  },
  {
    quote:
      "The custom React web application and Next.js backend they engineered was flawless. Pixel-perfect attention to detail, lightning-fast API responses, and clean TypeScript code throughout.",
    author: "Elena Rostova",
    role: "Product Director, Luminara Bio",
    rating: 5,
    platform: "React / Next.js",
    avatar: "ER",
    accent: "from-cyan-500/20 to-blue-500/10",
  },
  {
    quote:
      "Outstanding communication and delivery on our complex Squarespace & custom CSS animations. They met every single milestone ahead of schedule. Truly top 1% Fiverr agency talent.",
    author: "Marcus Chen",
    role: "Creative Director, Studio Kroma",
    rating: 5,
    platform: "Squarespace / CSS",
    avatar: "MC",
    accent: "from-purple-500/20 to-emerald-500/10",
  },
  {
    quote:
      "Our 3D WebGL interactive landing page created a huge buzz at our product launch. Smooth 60fps on mobile and desktop alike. You won't find a better agency for interactive 3D web experiences.",
    author: "David Thorne",
    role: "Co-Founder, Synthetix Audio",
    rating: 5,
    platform: "Three.js / WebGL",
    avatar: "DT",
    accent: "from-emerald-500/20 to-amber-500/10",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section id="reviews" className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
            ⭐ Client Verification &amp; Reviews
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white leading-tight">
            Trusted by Builders, <span className="text-emerald-400">Brands &amp; Founders</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base font-medium mt-4">
            Over 540+ digital orders delivered with consistent five-star satisfaction ratings.
          </p>
        </div>

        {/* Featured Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br ${t.accent} blur-3xl pointer-events-none`} />

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                ))}
                <span className="text-xs font-mono font-bold text-white/40 ml-2">5.0 / 5.0</span>
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-white/5 border border-white/10 text-emerald-400">
                {t.platform}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="relative z-10"
              >
                <Quote className="w-10 h-10 text-emerald-500/20 mb-4" />
                <p className="text-lg sm:text-2xl font-medium text-white/90 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-black text-sm font-sans shadow-lg shadow-emerald-500/20">
                      {t.avatar}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white">{t.author}</h4>
                      <p className="text-xs text-white/50 font-medium">{t.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={prev}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-105 active:scale-95"
                      aria-label="Previous review"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-white/40 px-2">
                      {current + 1} / {testimonials.length}
                    </span>
                    <button
                      onClick={next}
                      className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all hover:scale-105 active:scale-95"
                      aria-label="Next review"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
